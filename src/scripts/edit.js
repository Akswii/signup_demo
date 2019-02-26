window._nodeIds = [];

$(function () {
    var datascource = {
        name: '<div class="first-title"><h4>TEST BILPLEIE V/WAAGBØ</h4></div>',
        custom_content: '<i class="material-icons add-child">add</i>',
    };

    // <div class="accordion">
    //                 <label class="d-block">ADRESSE</label>
    //                 <p>Langlandsveien 230 </br> 7234 LER </p>
    //                 <label class="d-block">LAND</label>
    //                 <p>Norge</p>
    //             </div>

    var getId = function () {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var oc = $('#chart-container').orgchart({
        'data': datascource,
        'nodeContent': 'custom_content',
        'chartClass': 'edit-state',
        'pan': true,
        'createNode': ($node, data) => {
            const id = getId();
            $node[0].id = id;

            window._nodeIds.push(id);
        }
    });

    oc.$chartContainer.on('click', '.node', function () {
        var $this = $(this);

        $('#selected-node').text($this.find('.title span').text()).data('node', $this);
    });

    oc.$chartContainer.on('click', '.orgchart', function (event) {
        if (!$(event.target).closest('.node').length) {
            $('#selected-node').text('');
        }
    });

    $('input[name="node-type"]').on('click', function () {
        var $this = $(this);

        if ($this.val() === 'parent') {
            $('#edit-panel').addClass('edit-parent-node');
            $('#new-nodelist').children(':gt(0)').remove();
        } else {
            $('#edit-panel').removeClass('edit-parent-node');
        }
    });

    $('#btn-add-nodes').on('click', function () {
        var $chartContainer = $('#chart-container');
        const $newNodelist = $("#new-nodelist");
        const nodeVals = [];
        
        const type = $("#ownership-form-group").find("input[name='legal-physical']:checked").val();

        const country = $newNodelist.find(".node-country").val();
        const nationality = $newNodelist.find(".node-nationality").val();
        const name = $newNodelist.find(".node-name").val();
        const email = $newNodelist.find(".node-email").val();
        const orgnr = $newNodelist.find(".node-orgnr").val();
        const birthnr = $newNodelist.find(".node-birthnr").val();
        const address = $newNodelist.find(".node-address").val();
        const postnr = $newNodelist.find(".node-postnr").val();
        const postarea = $newNodelist.find(".node-postarea").val();
        const share = $newNodelist.find(".node-share").val();

        const personTemplate = `<span class="d-flex mt-2"><i class="material-icons mr-2">person</i>${birthnr}</span>`;
        const companyTemplate =`<span class="d-flex mt-2"><i class="material-icons mr-2">domain</i>${orgnr}</span><i class="material-icons add-child">add</i>`;

        if (type === "legal") {
            nodeVals.push({
                title: `<div class="custom-title"><h4 class="text-brand">${name}</h4></div>`,
                content: companyTemplate
            })
        } else {
            nodeVals.push({
                title: `<div class="custom-title"><h4 class="text-brand">${name}</h4></div>`,
                content: personTemplate
            })
        }

        var $node = $('#selected-node').data('node');

        if (!nodeVals.length) {
            console.warn('Please input value for new node');
            return;
        }

        var hasChild = $node.parent().attr('colspan') > 0 ? true : false;

        if (!hasChild) {
            const rel = nodeVals.length > 1 ? '110' : '100';
            const id = getId();

            const test = oc.addChildren($node, nodeVals.map((item) => {
                return {
                    'name': item.title,
                    'custom_content': item.content,
                    'relationship': rel,
                    'id': id
                };
            }));
        } else {
            oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'),
                nodeVals.map((item) => {
                    return {
                        'name': item.title,
                        'custom_content': item.content,
                        'relationship': '110',
                        'id': getId()
                    };
                }));
        }
    });

    $('#btn-delete-nodes').on('click', function () {
        var $node = $('#selected-node').data('node');

        if (!$node) {
            alert('Please select one node in orgchart');
            return;
        } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
            if (!window.confirm('Are you sure you want to delete the whole chart?')) {
                return;
            }
        }

        oc.removeNodes($node);
        $('#selected-node').text('').data('node', null);
    });
});

$(() => {
    const getElem = id => ($(`#${id}`));

    const addListener = id => {
        const elem = getElem(id);
        const elemAddChild = elem.find(".add-child");
        const elemBody = elem.find(".content");

        elemAddChild.click(event => {
            // event.stopPropagation();
            px.sheet.open("demo-sheet");

            const $radioContainer = $("#ownership-form-group");
            const $fieldset = $("#new-nodelist");
            const $legal = $("#new-nodelist .legal");
            const $physical = $("#new-nodelist .physical");

            $radioContainer.find(".radio input").click(() =>  {
                let val = $radioContainer.find("input[name='legal-physical']:checked").val();

                if (val === "legal") {
                    $physical.addClass("d-none");
                    $legal.removeClass("d-none");
                } else if (val === "physical") {
                    $legal.addClass("d-none");
                    $physical.removeClass("d-none");
                }

                $fieldset.removeClass("d-none");
            });
        });

        elem.click(() => {
            elem.find(".first-title").length ? null : px.sheet.open("demo-edit-sheet");
        });
    };

    window._nodeIds.forEach(id => {
        addListener(id);
    });

    $("#btn-add-nodes").click(() => {
        addListener(window._nodeIds[window._nodeIds.length - 1]);
        px.sheet.close("demo-sheet");
    });
});
