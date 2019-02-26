window._nodeIds = [];

$(function () {
    var datascource = {
        name: '<span>TEST BILPLEIE V/WAAGBØ</span><i class="material-icons material-icons-tiny edit-node">edit</i><i class="material-icons add-child">add</i>',
        custom_content:
            `<div>
                <label>ORGNR</label>
                <p>819226032</p>
                <div class="accordion">
                    <label class="d-block">ADRESSE</label>
                    <p>Langlandsveien 230 </br> 7234 LER </p>
                    <label class="d-block">LAND</label>
                    <p>Norge</p>
                </div>
            </div>`,
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

        let country;
        let name;
        let email;
        let orgnr;
        let address;
        let postnr;
        let postarea;
        let share;
        let type;

        $newNodelist.find(".node-country").each((index, item) => country = item.value.trim());
        $newNodelist.find(".node-name").each((index, item) => name = item.value.trim());
        $newNodelist.find(".node-email").each((index, item) => email = item.value.trim());
        $newNodelist.find(".node-orgnr").each((index, item) => orgnr = item.value.trim());
        $newNodelist.find(".node-address").each((index, item) => address = item.value.trim());
        $newNodelist.find(".node-postnr").each((index, item) => postnr = item.value.trim());
        $newNodelist.find(".node-postarea").each((index, item) => postarea = item.value.trim());
        $newNodelist.find(".node-share").each((index, item) => share = item.value.trim());
        
        nodeVals.push({
            title: `<span>${name}</span><i class="material-icons material-icons-tiny edit-node">edit</i><i class="material-icons add-child">add</i>`,
            content:
                `<label>EIERANDEL</label>
                <p>${share}</p>
                <div class="accordion">
                    <label>ORGNR</label>
                    <p>${orgnr}</p>
                    <label>ADDRESS</label>
                    <p>${address}</p>
                    <label>Country</label>
                    <p>${country}</p>
                </div>`
        });

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
        const elemAddChild = elem.find(".title .add-child");
        const elemBody = elem.find(".content");

        elemAddChild.click(() => {
            px.sheet.open("demo-sheet");

            const $radioContainer = $("#ownership-form-group");
            const $fieldset = $("#new-nodelist");
            const $legal = $("#new-nodelist .legal");
            const $physical = $("#new-nodelist .physical");

            $radioContainer.find(".radio input").click(() =>  {
                let val = $radioContainer.find("input[name='test']:checked").val();

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

        elemBody.click(() => {
            elemBody.find(".accordion").css("display")  === "block" ? elemBody.find(".accordion").slideUp() : elemBody.find(".accordion").slideDown()
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
