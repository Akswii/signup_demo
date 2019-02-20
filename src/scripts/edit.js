$(function () {
    var datascource = {
        name: 'Firmanavn',
        test: 'testverdi',
    };

    var getId = function () {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var oc = $('#chart-container').orgchart({
        'data': datascource,
        'nodeContent': "verdien min",
        'chartClass': 'edit-state',
        'pan': true,
        'createNode': function ($node, data) {
            $node[0].id = getId();
        }
    });

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

    $('#btn-add-input').on('click', function () {
        $('#new-nodelist').append('<li><input type="text" class="new-node"></li>');
    });

    $('#btn-remove-input').on('click', function () {
        var inputs = $('#new-nodelist').children('li');
        if (inputs.length > 1) {
            inputs.last().remove();
        }
    });

    $('#btn-add-nodes').on('click', function () {
        var $chartContainer = $('#chart-container');
        var nodeVals = [];
        $('#new-nodelist').find('.new-node').each(function (index, item) {
            var validVal = item.value.trim();
            if (validVal.length) {
                nodeVals.push(validVal);
            }
        });
        var $node = $('#selected-node').data('node');
        if (!nodeVals.length) {
            console.warn('Please input value for new node');
            return;
        }
        var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
        if (!hasChild) {
            var rel = nodeVals.length > 1 ? '110' : '100';
            oc.addChildren($node, nodeVals.map(function (item) {
                return {
                    'name': item,
                    'relationship': rel,
                    'id': getId()
                };
            }));
        } else {
            oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'),
                nodeVals.map(function (item) {
                    return {
                        'name': item,
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

    $('#btn-reset').on('click', function () {
        $('.orgchart').find('.focused').removeClass('focused');
        $('#selected-node').val('');
        $('#new-nodelist').find('input:first').val('').parent().siblings().remove();
        $('#node-type-panel').find('input').prop('checked', false);
    });
});