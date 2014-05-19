//(function(){

  var i = 0;

  var settings = {
    w: window.innerWidth*0.5,
    h: window.innerHeight*0.75,
    duration: 500
  };

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
   width = 960 - margin.right - margin.left,
   height = 500 - margin.top - margin.bottom;


  var toggleChildren = function(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
      } else if (d._children) {
          d.children = d._children;
          d._children = null;
      }
      return d;
  };

  // Toggle children on click.

  var click = function(d) {
      if (d3.event.defaultPrevented) return; // click suppressed
      d = toggleChildren(d);
      update(d);
      // helpers.centerNode(d);
  };


  var tree = d3.layout.tree()
              .size([settings.w*0.5, settings.w*0.5]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });


  var vis = d3.select("div.canvas").append("svg:svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
      .attr("transform", "translate(40, 0)");

  root = treeData[0];
  
  update(root);

  ///////////////////////////////////////////
  function update(source) {

  // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
     links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Declare the nodesâ€¦
    var node = vis.selectAll("g.node")
     .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("svg:g")
     .attr("class", "node")
     .attr("transform", function(d) { 
      return "translate(" + source.y0 + "," + source.x0 + ")"; });//d.y + "," + d.x + ")"; });

    nodeEnter.append("svg:circle")
     .attr("r", 10)
     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
     .on('click', click);;
     // .append("ellipse")
     //  .attr("cx", 50)
     //  .attr("cy", 50)
     //  .attr("rx", 25)
     //  .attr("ry", 10);


    nodeEnter.append("svg:text")
     .attr("x", function(d) { return d._children ? -8 : 8; })
     .attr("y", 3)
     .text(function(d) { return d.text; })
     .style("fill-opacity", 1);

    nodeEnter.transition()
      .duration(settings.duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
          .style("opacity", 1)
        .select("circle")
          .style("fill", "lightsteelblue");

    node.transition()
      .duration(settings.duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

    node.exit().transition()
      .duration(settings.duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

    //Links between the nodes
    var link = vis.selectAll("path.link")
     .data(links, function(d) { return d.target.id; });

    // When the links enter
    link.enter().insert("svg:path", "g")
     .attr("class", "link")
     .attr("d", function(d) {
        var o = {x: settings.w, y: settings.h};
        return diagonal({source: o, target: o});
      })
      .transition()
        .duration(settings.duration)
        .attr("d", diagonal);

    link.transition()
      .duration(settings.duration)
      .attr("d", diagonal);


    // Update the links…
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(settings.duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

  };

 //////////////////////event listeners//////////

  var mouse = { x: settings.w, y: settings.h };

  // on canvas mousemove 
  vis.on('mousemove', function() {
    mouse = { x: d3.mouse(this)[0], y: d3.mouse(this)[1]};
  });




  //clicking on canvas creates a node (initialize with)
  //node class
    //properties
      //children
      //value / text
      //color
    //intialize
      //at the point of creation, there will be a prompt to enter the textual
      //contents of that node

      //clicking on a node after it has been created allows us to see its children

      //double tapping a node will cause a small x to appear on that node
        //NE (not essential)//if the node has children an are you sure pop up will appear (after a while)

      //dragging a node allows us to reposition a node

    //delete
      //removes the node 

    //add child



  //create a linked node

  //this is a natural tree structure, so implement it as a tree


  //a node can have a 






//}).call(this);

