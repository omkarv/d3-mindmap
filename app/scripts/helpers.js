var viewerWidth = 500;
var viewerHeight = 500;
var panSpeed = 200;

function flatten(root) {
  var nodes = [], i = 0;

    function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    // console.log(node)
        delete node.parent;
        delete node.x;
        delete node.y;
        delete node.x0;
        delete node.y0;
        delete node.id;
        delete node.depth;
        delete node.__proto__;
    }
  recurse(root);
  // console.log(root);
  return root;
};

var helpers ={
   centerNode : function(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + settings.w / 2;
        y = y * scale + settings.h / 2;
        d3.select('g').transition()
            .duration(settings.duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    },
    visit :  function(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    },
    collapse : function(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    },

    expand : function(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(helpers.expand);
            d._children = null;
        }
    },
    pan : function(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                helpers.pan(domNode, speed, direction);
            }, 50);
        }
    }
};