var preview = document.getElementById('logo_preview');
var location_input = document.getElementById('location_input');
var event_input = document.getElementById('event_input');
var color_input = document.getElementById('color_input');
var layout_input = document.getElementById('layout_input');
var logo_type_input = document.getElementById('logo_type_input');

var default_location_text = "Community name";
var error_tip = "your community name";

var location_name, event_type;
var includeEvent;

var svg_element, location_element, event_element, base_logo_element;
var base_logo_width, base_logo_height;

updateLayout();

function updateLayout(filename){
    //Depending on Logo Type:
    //- show and hide Event Type controls
    //- add or remove an option for three-line layout.
    var threeLinesOption = document.getElementById('3_lines_option');

    if(logo_type_input.value === "Chapter"){
        event_type = "None";
        document.getElementById('event_type_div').style.display = "none";

        if(threeLinesOption){
            if(threeLinesOption.selected){
                document.getElementById('1_line_option').selected = "selected";
            }
            threeLinesOption.parentNode.removeChild(threeLinesOption);
        }
    }
    else if(logo_type_input.value === "Event"){
        event_type = event_input.value;

        document.getElementById('event_type_div').style.display = "inline";

        if(threeLinesOption === null){
            threeLinesOption = document.createElement("option");
            threeLinesOption.text = "Three lines";
            threeLinesOption.value = 3;
            threeLinesOption.id = '3_lines_option';
            layout_input.add(threeLinesOption);
        }
    }
    if(event_type === "None") {includeEvent = false;}
    else {includeEvent = true;}

    //Load base logo element (has dimensions, background color, 'Singularity U' text)
    var filename = "imgs/logo_" + layout_input.value + "_" + color_input.value +".svg";


    d3.xml(filename, "image/svg+xml", function(xml) {
      if(base_logo_element) preview.removeChild(base_logo_element);
      base_logo_element = xml.documentElement;
      preview.appendChild(base_logo_element);
      base_logo_width = parseInt(d3.select("svg").attr("width").slice(0, -2));
      base_logo_height = parseInt(d3.select("svg").attr("height").slice(0, -2));
      drawImages();
    });

}

function communityNameChanged(){
    document.getElementById('error').style.display = "none";
    drawImages();
}

function drawImages() {
    //CLEAR LOGO
    if(location_element) location_element.parentNode.removeChild(location_element);
    if(event_element) if(event_element.parentNode) event_element.parentNode.removeChild(event_element);
    document.getElementById("location_div").getElementsByTagName("p")[0].innerHTML = default_location_text;

    //SET COLORS
    var font_color;
    var back_color;

    if(color_input.value == "white"){
        back_color = "#FFF";
        font_color = "#000";
    }else if (color_input.value == "transparent") {
        back_color = "#FFF";
        font_color = "#000";
    }
    else{
        back_color = "#000";
        font_color = "#FFF";
    }
    if(!includeEvent){
        font_color = "#5EB5E2;"
    }

    //CREATE NEW ELEMENTS AND ATTACH TO SVG
    //this needs to be done before we can access their bounding boxes (which we need in order to calculate their position in the layout section)
    svg_element = document.getElementsByTagName("svg")[0];

    location_name = location_input.value;
    location_element = document.createElementNS("http://www.w3.org/2000/svg","text");
    location_element.setAttributeNS(null,"font-size","43.09");
    location_element.setAttributeNS(null,"font-family","cooper_hewittbook");
    location_element.setAttributeNS(null,"style","fill:"+font_color+";");
    location_element.appendChild(document.createTextNode(location_name));
    svg_element.appendChild(location_element);

    if(includeEvent){
        event_element = document.createElementNS("http://www.w3.org/2000/svg","text");
        event_element.setAttributeNS(null,"font-size","43.09");
        event_element.setAttributeNS(null,"font-family","cooper_hewittbook");
        event_element.setAttributeNS(null,"style","fill:#5EB5E2;");
        event_element.appendChild(document.createTextNode(event_type));
        svg_element.appendChild(event_element);
    }

    //LAYOUT: POSITION NEW ELEMENTS AND UPDATE LOGO WIDTH
    var x_location, y_location;
    var x_event, y_event;
    var new_width;

    var singularityUwidth = 222.042;

    switch(layout_input.value){
        case "1":
            x_location = 345.997;
            y_location = 84.0508;

            new_width = 356.622 + location_element.getBBox().width + 7 + 23.991;

            if(includeEvent){
                x_event =  x_location + location_element.getBBox().width + 7;
                y_event = y_location;
                new_width += event_element.getBBox().width;
            }

            break;
        case "2":
            var right_padding = 31.972;

            var singularity_u_x = 141.8594;
            var after_singularity_u_x = 375.105;

            var first_line_y = 79.7744;
            var second_line_y = first_line_y + 47.098;

            if(includeEvent){
                x_location = after_singularity_u_x;
                y_location = first_line_y;

                x_event =  singularity_u_x;
                y_event = second_line_y;

                new_width = after_singularity_u_x + location_element.getBBox().width + right_padding;
            }
            else{
                x_location =  singularity_u_x;
                y_location = second_line_y;

                if(location_element.getBBox().width < singularityUwidth){
                    // new_width = base_logo_width;
                    new_width = after_singularity_u_x + right_padding;
                }
                else{
                    new_width = x_location +  location_element.getBBox().width + right_padding;
                }
            }
            break;
        case "3":
            var right_padding = 32.061;
            var singularity_u_x = 170.747;
            var singularityUwidth = 222.042;

            var first_line_y = 73.355;
            var second_line_y = first_line_y + 47.792;
            var third_line_y = first_line_y + 94.411;

            x_location = singularity_u_x;
            y_location = second_line_y;

            x_event = singularity_u_x;
            y_event = third_line_y;

            if(location_element.getBBox().width < singularityUwidth)    {
                new_width = base_logo_width;
            }
            else{
                new_width = x_location +  location_element.getBBox().width +  right_padding;
            }
            break;
    }

    location_element.setAttributeNS(null,"x", x_location);
    location_element.setAttributeNS(null,"y", y_location);
    if(event_element){
        event_element.setAttributeNS(null,"x", x_event);
        event_element.setAttributeNS(null,"y", y_event);
    }
    svg_element.setAttributeNS(null, "width", new_width);
    svg_element.setAttributeNS(null, "viewBox", "0 0 "+ new_width + " " + base_logo_height);

    //update background rect
    //note: there needs to be a layer called 'background' in the Illustrator file, containing the background rectangle.
    var backgroundRect = document.getElementById("background").getElementsByTagName("rect")[0];
    backgroundRect.setAttributeNS(null, "width", new_width);
    backgroundRect.setAttributeNS(null, "height", base_logo_height);
    backgroundRect.setAttributeNS(null, "style", "fill:" + back_color + ";");


}

function downloadSVG(link, filename) {

    //resize SVG for creating JPG with height = 250
    var scaledSVG = svg_element.cloneNode(true);
    var bitmapHeight = 250;
    var bitmapWidth = bitmapHeight * svg_element.getBBox().width / svg_element.getBBox().height;
    scaledSVG.setAttributeNS(null,"width", bitmapWidth);
    scaledSVG.setAttributeNS(null, "height", bitmapHeight);
    document.body.appendChild(scaledSVG);

    var targetCanvas = document.createElement('canvas');
    targetCanvas.width = bitmapWidth;
    targetCanvas.height = bitmapHeight;

    targetCanvas.id = filename;
    document.body.appendChild(targetCanvas);
    var ctx = targetCanvas.getContext('2d');

    var img = new Image();
    var xml = (new XMLSerializer()).serializeToString(scaledSVG);
    img.src = "data:image/svg+xml;base64," + btoa(xml);
    img.onload = function() {
        // after this, Canvas’ origin-clean is DIRTY
        ctx.drawImage(img, 0, 0);
        targetCanvas.toBlob(function(blob) {
            saveAs(
                  blob
                , filename);
            }, "image/png");

        document.body.removeChild(scaledSVG);
        document.body.removeChild(targetCanvas);
    }

}

document.getElementById('download').addEventListener('click', function() {
    if(location_name != default_location_text && location_name !== "" && location_name !== error_tip){
        // var format = format_input.value;
        var format = "png"
        downloadSVG(this, 'Singularity_U_' + location_name + '_' + event_type + '_' + color_input.value + '_' + layout_input.value + '_lines.' + format);
    }
    else{
        document.getElementById('error').style.display = "block";
        location_input.value = error_tip;
        location_input.select();
    }

}, false);
