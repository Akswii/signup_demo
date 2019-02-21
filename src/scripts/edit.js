window._orgcharts = [];

$(function () {
    var datascource = {
        name: '<div class="d-flex justify-content-center align-items-center"><i class="fas fa-building mr-1"></i>TEST BILPLEIE V/WAAGBØ<div>',
        custom_content: "<label>ORGNR</label><p>819226032</p>",
    };

    var getId = function () {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var oc = $('#chart-container').orgchart({
        'data': datascource,
        'nodeContent': 'custom_content',
        'chartClass': 'edit-state',
        'pan': true,
        'createNode': function ($node, data) {
            $node[0].id = getId();
        }
    });

    window._orgcharts.push(oc);

    oc.$chartContainer.on('click', '.node', function () {
        var $this = $(this);

        $('#selected-node').val($this.find('.title').text()).data('node', $this);
    });

    oc.$chartContainer.on('click', '.orgchart', function (event) {
        if (!$(event.target).closest('.node').length) {
            $('#selected-node').val('');
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

        let $title = $newNodelist.find(".new-node");

        $title.length ? $title.each((index, item) => {
            $title = item.value.trim();
        }) : null;

        nodeVals.push({
            title: $title,
            content: testValue,
            content2: testValue2
        });

        console.table(nodeVals);

        var $node = $('#selected-node').data('node');

        if (!nodeVals.length) {
            console.warn('Please input value for new node');
            return;
        }
        var hasChild = $node.parent().attr('colspan') > 0 ? true : false;

        if (!hasChild) {
            var rel = nodeVals.length > 1 ? '110' : '100';

            oc.addChildren($node, nodeVals.map((item) => {
                return {
                    'name': item.title,
                    'custom_content': item.content,
                    'relationship': rel,
                    'id': getId()
                };
            }));
        } else {
            oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'),
                nodeVals.map(function (item) {
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
        $('#selected-node').val('').data('node', null);
    });
});
