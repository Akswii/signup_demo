window._orgcharts = [];
window._nodes = [];

$(function () {
    var datascource = {
        name: '<div class="d-flex justify-content-center align-items-center"><i class="fas fa-building mr-1"></i>TEST BILPLEIE V/WAAGBØ<div>',
        custom_content:
            `<div>
                <label>ORGNR</label>
                <p>819226032</p>
                <div id="accordion">
                    <div>
                        <label class="d-block">ADRESSE</label>
                        <p>Langlandsveien 230 </br> 7234 LER </p>
                        <label class="d-block">LAND</label>
                        <p>Norge</p>
                    </div>
                </div>
            </div>`,
        // custom_content: "<div id='accordion'><h5>hello</h5><div>wassap</div></div>",
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
        let $title;
        let $eierandel;
        let $orgnr;

        $newNodelist.find(".node-title").each((index, item) => $title = item.value.trim());
        $newNodelist.find(".node-andel").each((index, item) => $eierandel = item.value.trim());
        $newNodelist.find(".node-orgnr").each((index, item) => $orgnr = item.value.trim());

        // $title.length ? $title.each((index, item) => {
        //     $title = item.value.trim();
        // }) : null;

        nodeVals.push({
            title: $title,
            content: `<label>EIERANDEL</label><p>${$eierandel}</p><label>ORGNR</label><p>${$orgnr}</p>`,
        });

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
