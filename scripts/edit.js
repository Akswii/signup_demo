window._nodeIds = [];
window._oc = [];

$(function () {
    var datascource = {
        name: '<div class="first-title"><h4>TEST BILPLEIE V/WAAGBØ</h4></div>',
        custom_content: '<i class="material-icons add-child">add</i>',
    };

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

    window._oc.push(oc);

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

        const companyType = $newNodelist.find("input[name='add-child']:checked").val();

        const personTemplate = `
            <span class="d-flex mt-2">
                <i class="material-icons mr-2">face</i>
                ${birthnr || "73577357735"}
            </span>`;
        const companyTemplate =`
            <span class="d-flex mt-2">
                <i class="material-icons mr-2">domain</i>
                ${orgnr || "73577357735"}
            </span>
            ${companyType === "children" ?  '<i class="material-icons add-child">add</i>' : ""}`;

        if (type === "legal") {
            nodeVals.push({
                title: `
                    <div class="custom-title">
                        <h4 class="text-brand">${name || "Testing"}</h4>
                    </div>
                    <i class="material-icons delete-node">close</i>`,
                content: companyTemplate
            })
        } else if (type === "physical") {
            nodeVals.push({
                title: `
                    <div class="custom-title">
                        <h4 class="text-brand">${name || "Testing"}</h4>
                    </div>
                    <i class="material-icons delete-node">close</i>`,
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
});

$(() => {
    const getElem = id => ($(`#${id}`));

    const addBtnListener = id => {
        const elem = getElem(id);
        const elemAddChild = elem.find(".add-child");
        const elemBody = elem.find(".content");
        const elemDel = elem.find(".delete-node");
        let newNodeOpen = false;

        elem.on("click", () => {
            newNodeOpen ? null : elem.find(".first-title").length ? null : px.sheet.open("demo-edit-sheet");
        });

        elemDel.on("click", (event) => {
            var $node = $(`#${event.target.closest(".node").id}`);

            if (!$node) {
                alert('Please select one node in orgchart');
                return;
            } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
                if (!window.confirm('Are you sure you want to delete the whole chart?')) {
                    return;
                }
            }

            window._oc[0].removeNodes($node);
            $('#selected-node').text('').data('node', null);
        });

        elemAddChild.on("click", () => {
            px.sheet.open("demo-sheet");
            newNodeOpen = true;

            const $radioContainer = $("#ownership-form-group");
            const $fieldset = $("#new-nodelist");
            const $legal = $("#new-nodelist .legal");
            const $physical = $("#new-nodelist .physical");

            $radioContainer.find(".radio input").on("click", () =>  {
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
    };

    window._nodeIds.forEach(id => {
        addBtnListener(id);
    });

    $("#btn-add-nodes").click(() => {
        addBtnListener(window._nodeIds[window._nodeIds.length - 1]);
        px.sheet.close("demo-sheet");
        newNodeOpen = false;
    });
});
