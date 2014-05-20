//(function(){

  var i = 0;
  
  var settings = {
    w: window.innerWidth*0.5,
    h: window.innerHeight*0.75,
    duration: 500
  };

 
  var panBoundary = 20;

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
   width = 960 - margin.right - margin.left,
   height = 500 - margin.top - margin.bottom;


  dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                helpers.pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                helpers.pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                helpers.pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                helpers.pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                helpers.expand(selectedNode);
               // sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });
    


  var endDrag = function() {
      selectedNode = null;
      d3.selectAll('.ghostRect').attr('class', 'ghostRect');
      d3.select(domNode).attr('class', 'node');
      // now restore the mouseover event or we won't be able to drag a 2nd time
      d3.select(domNode).select('.ghostRect').attr('pointer-events', '');
      updateTempConnector();
      if (draggingNode !== null) {
          update(root);
          centerNode(draggingNode);
          draggingNode = null;
      }
  };

  function sortTree() {
      tree.sort(function(a, b) {
          return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
      });
  };


  
  function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostRect').attr('pointer-events', 'none');
        d3.selectAll('.ghostRect').attr('class', 'ghostRect show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
  }
  var endDrag = function() {
      selectedNode = null;
      d3.selectAll('.ghostRect').attr('class', 'ghostRect');
      d3.select(domNode).attr('class', 'node');
      // now restore the mouseover event or we won't be able to drag a 2nd time
      d3.select(domNode).select('.ghostRect').attr('pointer-events', '');
      updateTempConnector();
      if (draggingNode !== null) {
          update(root);
          centerNode(draggingNode);
          draggingNode = null;
      }
  }

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

  var click = function(d) {// root) {
      if (d3.event.defaultPrevented) return; // click suppressed
      d = toggleChildren(d);
      update(d);//, root); // make this specifc to that node
      centerNode(d);
  };

  var deleteNode = function(d){ // root) {
     if (d==root) { //do not allow deletion of the root node
      return;
     }
     // console.log(d.parent.children.indexOf(d));
     var index = d.parent.children.indexOf(d);
     d.parent.children.splice(index,1);
     update(d);//, root);
  }

  var overCircle = function(d) {
      selectedNode = d;
      updateTempConnector();
  };

  var outCircle = function(d) {
      selectedNode = null;
      updateTempConnector();
  };

    // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function() {
      var data = [];
      if (draggingNode !== null && selectedNode !== null) {
          // have to flip the source coordinates since we did this for the existing connectors on the original tree
          data = [{
              source: {
                  x: selectedNode.y0,
                  y: selectedNode.x0
              },
              target: {
                  x: draggingNode.y0,
                  y: draggingNode.x0
              }
          }];
      }
      var link = svgGroup.selectAll(".templink").data(data);

      link.enter().append("path")
          .attr("class", "templink")
          .attr("d", d3.svg.diagonal())
          .attr('pointer-events', 'none');

      link.attr("d", d3.svg.diagonal());

      link.exit().remove();
  };

  var centerNode = function(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(settings.duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

  var draggingNode = null;
  var selectedNode = null;

  var tree = d3.layout.tree()
              .size([settings.w*0.5, settings.w*0.5]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });


  var vis = d3.select("div.canvas").append("svg:svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
      .attr("transform", "translate(40, 0)")
  
  // d3.select(".canvas").on('click', function() {
  //     mouse = { x: d3.mouse(this)[0], y: d3.mouse(this)[1]};
  //     createMindMap(mouse.x, mouse.y);
  // });
  var svgGroup = vis.append("g");

  root = treeData[0];
  
  update(root);
  centerNode(root);


  ///////////////////////////////////////////
  function update(source) {//, root) {

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
     .call(dragListener)
     .attr("class", "node")
     .attr("transform", function(d) { 
      return "translate(" + source.y0 + "," + source.x0 + ")"; });//d.y + "," + d.x + ")"; });

    nodeEnter.append("svg:rect") //circle")
     //.attr("r", 10)
     .attr("x", 0)
     .attr("y", -20)
     .attr("width", 80)
     .attr("height", 50)
     .attr("rx", 20)
     .attr("ry", 20)
     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
     .on('click', click
      // console.log(d);
      // mouse = { x: d3.mouse(this)[0], y: d3.mouse(this)[1]};
     // click(d, root);
     )
     .on('dblclick', deleteNode//function(d) {
      //console.log('in doubleclick', d);

    //  deleteNode(d, root);
     );
     // .append("ellipse")
     //  .attr("cx", 50)
     //  .attr("cy", 50)
     //  .attr("rx", 25)
     //  .attr("ry", 10);


    nodeEnter.append("svg:text")
     .attr("x", function(d) { return  8; }) //d._children ? -8 :
     .attr("y", 10)
     .attr('width', 60)
     .text(function(d) { return d.text; })
     .style("fill-opacity", 1)
     .on('click', function(d) {
       d3.select(this)
         .text(function(d){
            // console.log(d);
            var newText = prompt("Enter the text here") || d.text;     
            d.text = newText;
            return newText;
          });
      }, this);

    nodeEnter.append("rect")
            .attr('class', 'ghostRect')
            .attr("rx", 20)
            .attr("ry", 20)
            .attr('x', -10)
            .attr('y', -35 )
            .attr('height', 80)
            .attr('width', 100)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });
    // debugger;
    nodeEnter.transition()
       // .call(dragListener)
      .duration(settings.duration)
      .attr("transform", function(d) { 
        var ypos = d.y - 10;
        var xpos = d.x - 20;
        return "translate(" + d.y + "," + d.x + ")"; })
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
    var link = vis.selectAll("path.link") // will need specific ids /classes for each trees links
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

  // on canvas mousemove 
  // vis.on('mousemove', function() {
  //   mouse = { x: d3.mouse(this)[0], y: d3.mouse(this)[1]};
  //   console.log(mouse);
  // });

  //on canvas click (prevent this action being executed when on other nodes)

  //to make a new node, drag from new node to required node

  //need to create drag and drop functionality first

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

