$(function () {
    var defaultTop = "100px";
    var defaultLeft = "250px";
    var defaultWidth = "150px";
    var defaultHeight = "50px";

    var $canvas = $("#canvas");

    var count = 0;

    var $selectedDiv = null;

    $("#text-modal-save").click(function () {
        var text = $("#edit-text-area").val();
        $selectedDiv.find(".text").html(text);
        $('#text-modal').modal("hide");
    });

    $("#properties-panel").draggable({
        handle : ".panel-heading"
    });

    $("#close-properties").click(function () {
        $("#properties-panel").addClass("hide");
    });

    $('#edit-text-area').ckeditor();

    function setSelected($div) {
        $selectedDiv = $div;
        $(".selected").removeClass("selected");
        $div.addClass("selected");
        updateProperties();
    }

    function updateProperties() {
        $.each($selectedDiv.data(), function (key, value) {
            $("#" + key).val(value);
        });
    }

    function toggleProperties() {
        if ($selectedDiv != null) {
            $("#properties-panel").removeClass("hide");
            updateProperties();
        } else {
            $("#properties-panel").addClass("hide");
        }
    }

    function createTextDiv() {
        var $div = $("<div>");
        var id = "text-" + count;
        count++;
        $div.attr("id", id);

        $div.addClass("element");
        $div.addClass("default-text");

        $div.css({
            position : "absolute",
            top      : defaultTop,
            left     : defaultLeft,
            width    : defaultWidth,
            height   : defaultHeight
        });
        $div.data({
            "top"    : defaultTop,
            "left"   : defaultLeft,
            "width"  : defaultWidth,
            "height" : defaultHeight
        });
        setSelected($div);
        $div.append("<div class='text'>Demo text</div>");
        $canvas.append($div);
        return $div;
    }

    function makeDivResizable($div) {
        $div.resizable({
            containment : '#canvas',
            start       : function () {
                setSelected($(this));
            },
            stop        : function (_event, ui) {
                var width = ui.size.width + "px";
                var height = ui.size.height + "px";
                $(this).data({
                    width  : width,
                    height : height
                });
                updateProperties();
            }
        });
    }

    function makeDivSelectable($div) {
        $div.click(function () {
            setSelected($(this));
        });
    }

    function makeDivDraggable($div) {
        $div.draggable({
            containment : '#canvas',
            stack       : ".element",
            start       : function () {
                setSelected($(this));
            },
            stop        : function (_event, ui) {
                var top = ui.position.top + "px";
                var left = ui.position.left + "px";
                $(this).data({
                    top  : top,
                    left : left
                });
                updateProperties();
            }
        });
    }

    function createDeleteButton($bar) {
        var $delete = $("<a href='#'>");
        $delete.addClass("item text-danger");
        $delete.append('<i class="fa fa-trash-o"></i>');
        $delete.click(function () {
            $(this).parents(".element").remove();
            return false;
        });
        $bar.append($delete);
    }

    function createPropertiesButton($bar) {
        var $properties = $("<a href='#'>");
        $properties.addClass("item");
        $properties.append('<i class="fa fa-cogs"></i>');
        $properties.click(function () {
            toggleProperties();
            return false;
        });
        $bar.append($properties);
    }

    function createEditTextButton($bar) {
        var $text = $("<a href='#'>");
        $text.addClass("item text-muted");
        $text.append('<i class="fa fa-font"></i>');
        var $div = $bar.parents(".element");
        var id = $div.attr("id");
        $text.click(function () {
            $('#text-modal').modal("show");
            $("#edit-text-area").val($div.text());
            return false;
        });
        $bar.append($text);
    }

    function makeToolbar($div) {
        var $bar = $("<div>");
        $bar.addClass("toolbar");
        $div.append($bar);

        createDeleteButton($bar);
        createPropertiesButton($bar);
        createEditTextButton($bar);

    }

    $("#add-text").click(function () {
        var $div = createTextDiv();
        makeDivSelectable($div);
        makeDivResizable($div);
        makeDivDraggable($div);
        makeToolbar($div);
    });
    $("select.js-toggle-style").change(function () {
        var $this = $(this);
        var property = $this.attr("id");
        var value = $this.val();
        $selectedDiv.css(property, value);
        $selectedDiv.data(property, value);
    });
    $("input.js-toggle-style").blur(function () {
        var $this = $(this);
        var property = $this.attr("id");
        var value = $this.val();
        $selectedDiv.css(property, value);
        $selectedDiv.data(property, value);
    });
});
