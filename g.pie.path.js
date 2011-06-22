/*
* g.Raphael 0.4.1 - Charting library, based on Raphaël
*
* Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/


/*
*  Draw a ringchart with given position, size, values and options.
*/
Raphael.fn.g.ringchart_paths = function (x, y, width, height, values, opts)
{  
    opts = opts || {};
    var paper = this,
        sectors = [],
        covers = this.set(),
        chart = this.set(),
        series = this.set(),
        order = [],
        multi = 0,
        len = values.length,
        angle = 0,
        total = 0,
        others = 0,
        cut = 9,
        defcut = true,
        colors = opts.colors || this.g.colors,
        r = Math.min(width, height)/2.0,
        radpart = r/2, //divided radius
        cx = x+width/2.0,
        cy = y+height/2.0,
        labelposx = [],
        labelposy = [];
   chart.covers = covers;   
    
    //setup colors
    colors = new Array(6);
    for(var i = 0; i<6; i++)
    {
      colors[i] = new Array(5);
    }
    
    colors[0][0] = "#1751A7";
    colors[0][1] = "#2B65BB";
    colors[0][2] = "#3F79CF";
    colors[0][3] = "#538DE3";
    colors[0][4] = "#67A1F7";
    
    colors[1][0] = "#8AA717";
    colors[1][1] = "#9EBB2B";
    colors[1][2] = "#B2CF3F";
    colors[1][3] = "#C6E353";
    colors[1][4] = "#DAF767";
    
    colors[2][0] = "#A74217";
    colors[2][1] = "#BB562B";
    colors[2][2] = "#CF6A3F";
    colors[2][3] = "#E37E53";
    colors[2][4] = "#F79267";
    
    colors[3][0] = "#A78A17";
 
    colors[4][0] = "#3F0787";
 
    colors[5][0] = "#A71717";
  
    if (len == 1)
    {
        series.push(this.circle(cx, cy, r).attr({fill: this.g.colors[0], stroke: opts.stroke || "#fff", "stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth}));
        covers.push(this.circle(cx, cy, r).attr(this.g.shim));
        total = values[0];
        values[0] = {value: values[0], order: 0, valueOf: function () { return this.value; }};
        series[0].middle = {x: cx, y: cy};
        series[0].mangle = 180;
    }
    else
    {      
        function ringsector(x, y, rad1, rad2, ang1, ang2)
        {
            /* draw an arc segment with given inner radius rad1 and outer radius rad2.
               start in the middle of the inner arc, go to angle1 (0° = east), 
               go to the outer arc, go ccw to angle2 and back to the inner arc. */
        
            var steps=128;
         
            ang1 +=0.3;
            ang2 -=0.3;
            ang1 *= Math.PI/180; //convert deg to rad
            ang2 *= Math.PI/180;
            
            //create variables
            var steps1 = Math.floor(parseInt(steps)/4); //steps for straight lines and inner arc
        
            var steps_inner = Math.floor((rad1 / rad2) * steps1);
            var steps_outer = steps - 2*steps1 - steps_inner;
        
        
            var steps2 = steps1 + parseInt(steps) % 4;  //steps for outer arc
            var angdiff = ang2 - ang1;
            var angdiff2 = angdiff/2;
            var pi1x = x + rad1 * Math.cos(ang1); //inner circle
            var pi1y = y - rad1 * Math.sin(ang1);
            var pi2x = x + rad1 * Math.cos(ang2);
            var pi2y = y - rad1 * Math.sin(ang2);
            var pihx = x + rad1 * Math.cos(ang1+angdiff2); //starting point (inner arc center)
            var pihy = y - rad1 * Math.sin(ang1+angdiff2);
            var po1x = x + rad2 * Math.cos(ang1); //outer circle
            var po1y = y - rad2 * Math.sin(ang1);
            var po2x = x + rad2 * Math.cos(ang2);
            var po2y = y - rad2 * Math.sin(ang2);
            
        
            console.log(steps1);
            console.log(steps2);
        
            //create path
            var path = [];
            path.push('M'+pihx+' '+pihy); //starting point
        
            //path part 1: starting point to inner arc end point
            steps1f = Math.floor(steps_inner/2);
            var tang = (angdiff2)/steps1f;
            for(var i=1; i<=steps1f; i+=1) {
                path.push('L'+(x+rad1*Math.cos(ang1+angdiff2-i*tang)));
                path.push(' '+(y-rad1*Math.sin(ang1+angdiff2-i*tang)));
            }
            
            //path part 2: straight line from inner to outer arc
            var t1x = (po1x-pi1x)/steps1;
            var t1y = (po1y-pi1y)/steps1; 
            for(var i=1; i<=steps1; i+=1) {
                path.push('L'+(pi1x+(t1x*i))+' '+(pi1y+(t1y*i)));
            }
            
            //path part 3: outer arc
            var tang = angdiff/steps_outer;
            for(var i=1; i<=steps_outer; i+=1) {
                path.push('L'+(x+rad2*Math.cos(ang1+i*tang)));
                path.push(' '+(y-rad2*Math.sin(ang1+i*tang)));
            }
            
            //path part 4: straight line from outer to inner arc
            var t2x = (pi2x-po2x)/steps1;
            var t2y = (pi2y-po2y)/steps1; 
            for(var i=1; i<=steps1; i+=1) {
                path.push('L'+(po2x+(t2x*i))+' '+(po2y+(t2y*i)));
            }
            
            //path part 5: inner arc starting point to starting point
            steps1c = Math.ceil(steps_inner/2);
            var tang = angdiff2/steps1c;
            for(var i=1; i<steps1c; i+=1) {
                path.push('L'+(x+rad1*Math.cos(ang2-i*tang)));
                path.push(' '+(y-rad1*Math.sin(ang2-i*tang)));
            }
        
            //close path
            path.push('Z');
        
            return path.join('');
        }
        //end of ringsector-function
                
         
        for (var i = 0; i < len; i++)
        {
            if(values[i].length==null)
            {
               total += values[i].value;
            }
            else
            {
              for (var j = 0; j < values[i].length; j++)
              {
                 total += values[i][j].value;
              }
            }
        }
        
        /*values.sort(function (a, b)
        {
            return b.value - a.value;
        });*/

        
        var lastangle = 0;   
        var nextangle = 0;
        var factor = 360/total;
        var ir = r/2;
        var or = r*0.7;
        var sw = false;
        var step = 0;
            
        for (i = 0; i < len; i++)
        {          
          var lx, ly;
        
          if(values[i].length==null)
          {
              if(opts.separate)
              {
                if(sw)
                {
                  ir = r/4;
                  or = r/2.2;
                  
                }
                else
                {
                  ir = r/2;
                  or = r*0.7;
                }
                sw = !sw;
              }
              
              nextangle = lastangle + values[i].value * factor;
              var pathd = {
                          obj: ringsector(cx, cy, ir, or, lastangle, nextangle),
                          path: ringsector(cx, cy, ir, or, lastangle, nextangle),
                          key: values[i].key,
                          attr: {stroke: "none", fill: colors[i][0]},
                          value: values[i].value,
                          };    
             
             var e = paper.ellipse(cx + r*1.2, cy - r*0.5 + step, 8, 8);
             e.attr(pathd.attr);
             var t = paper.text(cx + r + 32, cy - r*0.5 + step, values[i].label);
             step += 20;
             t.translate(( - t.getBBox().width)/2, 0);
             sectors.push(pathd);
             lastangle = nextangle;
                      
          }
          else
          {
            for (var j = 0; j < values[i].length; j++)
            {
              if(opts.separate)
              {
                if(sw)
                {
                  ir = r/4;
                  or = r/2.2;
                  
                }
                else
                {
                  ir = r/2;
                  or = r*0.7;
                }
                sw = !sw;
              }
              
              nextangle = lastangle + values[i][j].value * factor;
              var pathd = {
                          obj: ringsector(cx, cy, ir, or, lastangle, nextangle),
                          path: ringsector(cx, cy, ir, or, lastangle, nextangle),
                          key: values[i][j].key,
                          attr: {stroke: "none", fill: colors[i][j]},
                          value: values[i][j].value,
                          };
              
              var e = paper.ellipse(cx + r*1.2, cy - r*0.5 + step, 8, 8);
              e.attr(pathd.attr);
              var t = paper.text(cx + r + 32, cy - r*0.5 + step, values[i][j].label);
              step +=20;
              t.translate(( - t.getBBox().width)/2, 0);            
              sectors.push(pathd);
              lastangle = nextangle;
              
              
              //ir *= 1.03;         
              //or *= 1.03;
            } 
          }
        }
    }
    
    for(var i = 0; i<len; i++)
    {
      
      //this.g.text(labelposx[i], labelposy[i], "Raphaël");
    }
    

    chart.hover = function (fin, fout)
    {
        fout = fout || function () {};
        var that = this;
        
        for (var i = 0; i < len; i++)
        {
            (function (sector, cover, j)
            {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                
                cover.mouseover(function ()
                                {
                                    fin.call(o);
                                }).mouseout(function ()
                                            {
                                                fout.call(o);
                                            });
                                })(series[i], covers[i], i);
        }
        
        return this;
    };
    
    // x: where label could be put
    // y: where label could be put
    // value: value to show
    // total: total number to count %
    chart.each = function (f)
    {
        var that = this;
        for (var i = 0; i < len; i++)
        {
            (function (sector, cover, j)
             {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    x: sector.middle.x,
                    y: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                    };
                    
                f.call(o);
            })(series[i], covers[i], i);
        }
        
        return this;
    };
    
    chart.click = function (f)
    {
        var that = this;
        for (var i = 0; i < len; i++)
        {
            (function (sector, cover, j)
            {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                    };
                    
                cover.click(function () { f.call(o); });
            })(series[i], covers[i], i);
        }
        
        return this;
    };
    
    chart.inject = function (element)
                   {
                       element.insertBefore(covers[0]);
                   };
                   
    var legend = function (labels, otherslabel, mark, dir)
    {
        var x = cx + r + r / 5,
            y = cy,
            h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set();
        
        for (var i = 0; i < len; i++)
        {
            var clr = series[i].attr("fill"),
                j = values[i].order,
                txt;
            values[i].others && (labels[j] = otherslabel || "Others");
            labels[j] = paper.g.labelise(labels[j], values[i], total);
            chart.labels.push(paper.set());
            chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
            chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
            covers[i].label = chart.labels[i];
            h += txt.getBBox().height * 1.2;
        }
        
        var bb = chart.labels.getBBox(),
            tr = {
                east: [0, -bb.height / 2],
                west: [-bb.width - 2 * r - 20, -bb.height / 2],
                north: [-r - bb.width / 2, -r - bb.height - 10],
                south: [-r - bb.width / 2, r + 10]
                 }[dir];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    };
    
    if (opts.legend) 
    {
        legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
    }
    
    chart.push(series, covers);
    chart.sectors = sectors;  
    chart.series = series;
    chart.covers = covers; 
    chart.elements = chart.sectors;
    return chart;
};               