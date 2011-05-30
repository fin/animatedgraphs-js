/*
* g.Raphael 0.4.1 - Charting library, based on Raphaël
*
* Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
Raphael.fn.g.piechart = function (cx, cy, r, values, opts)
{
    opts = opts || {};
    var paper = this,
        sectors = [],
        covers = this.set(),
        chart = this.set(),
        series = this.set(),
        order = [],
        len = values.length,
        angle = 0,
        total = 0,
        others = 0,
        cut = 9,
        defcut = true;
    chart.covers = covers;              
    
    
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
        function sector(cx, cy, r, startAngle, endAngle, fill)
        {
            var rad = Math.PI / 180,
                /*x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad),
                ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2, "z"];
            res.middle = {x: xm, y: ym};  */
            //return res;
          //if(steps===undefined)
            steps=1024;
 
            startAngle *= Math.PI/180; //convert deg to rad
            endAngle *= Math.PI/180;
          
            var steps1 = Math.floor(parseInt(steps)/3); //steps for lines to tip
            var steps2 = steps1 + parseInt(steps) % 3;  //steps for arc
            var p1x = cx + r * Math.cos(startAngle);
            var p1y = cy - r * Math.sin(startAngle);
            var p2x = cx + r * Math.cos(endAngle);
            var p2y = cy - r * Math.sin(endAngle);
            var angdiff = endAngle - startAngle;
      
            //create path
            var path = [];
            path.push('M'+cx+' '+cy); //tip
      
            //path part 1: tip to arc starting point
            var t1x = (p1x-cx)/steps1;
            var t1y = (p1y-cy)/steps1; 
            
            for(var i=1; i<=steps1; i+=1)
            {
                path.push('L'+(cx+(t1x*i))+' '+(cy+(t1y*i)));
            }
          
            //path part 2: arc
            var tang = angdiff/steps2;
            
            for(var i=1; i<=steps2; i+=1)
            {
                path.push('L'+(cx+r*Math.cos(startAngle+i*tang)));
                path.push(' '+(cy-r*Math.sin(startAngle+i*tang)));
            }
          
            //path part 3: arc end point to tip
            var t2x = (cx-p2x)/steps1;
            var t2y = (cy-p2y)/steps1; 
            
            for(var i=1; i<steps1; i+=1)
            {
                path.push('L'+(p2x+(t2x*i))+' '+(p2y+(t2y*i)));
            }
      
            //close path
            path.push('Z');
      
            return path.join('');
        }
        //end of sector-function
        
        for (var i = 0; i < len; i++)
        {
            total += values[i];
            values[i] = {value: values[i], order: i, valueOf: function () { return this.value; }};
        }
        
        values.sort(function (a, b)
        {
            return b.value - a.value;
        });
        
        for (i = 0; i < len; i++)
        {
            if (defcut && values[i] * 360 / total <= 1.5)
            {
                cut = i;
                defcut = false;
            }
            
            if (i > cut) 
            {
                defcut = false;
                values[cut].value += values[i];
                values[cut].others = true;
                others = values[cut].value;
            }
        }
        
        len = Math.min(cut + 1, values.length);
        others && values.splice(len) && (values[cut].others = true);
              
        for (i = 0; i < len; i++)
        {
            var mangle = angle - 360 * values[i] / total / 2;
            if (!i)
            {
                angle = 90 - mangle;
                mangle = angle - 360 * values[i] / total / 2;
            }
            
            if (opts.init)
            {
                var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
            }
            
            var pathd = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
            //var p = this.path(opts.init ? ipath : path).attr({fill: opts.colors && opts.colors[i] || this.g.colors[i] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            //var p = this.path(path);
            //var hihi = this.path(path);
            //p.attr({fill: opts.colors && opts.colors[i] || this.g.colors[i] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            //p.value = values[i];
            //p.middle = path.middle;
            //p.mangle = mangle;
            sectors.push(pathd);
            series.push(pathd);
            //opts.init && p.animate({path: path.join(",")}, (+opts.init - 1) || 1000, ">");
        }
      
        
        /*for (i = 0; i < len; i++)
        {
            p = paper.path(sectors[i].attr("path")).attr(this.g.shim);
            opts.href && opts.href[i] && p.attr({href: opts.href[i]});
            p.attr = function () {};
            covers.push(p);
            series.push(p);
        }     */
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
    return chart;
};



Raphael.fn.g.ringchart = function (cx, cy, r, levels, values, opts)
{
    opts = opts || {};
    var paper = this,
        sectors = [],
        covers = this.set(),
        chart = this.set(),
        series = this.set(),
        order = [],
        len = values.length,
        angle = 0,
        total = 0,
        others = 0,
        cut = 9,
        defcut = true,
        radpart = r/levels; //divided radius
    chart.covers = covers;              
    
    
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
        function ringsector(x, y, rad1, rad2, ang1, ang2, steps)
        {
            /* draw an arc segment with given inner radius rad1 and outer radius rad2.
               start in the middle of the inner arc, go to angle1 (0° = east), 
               go to the outer arc, go ccw to angle2 and back to the inner arc. */
        
            if(steps===undefined)
                steps=1024;
         
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
            total += values[i][0];
            values[i][0] = {value: values[i][0], order: i, valueOf: function () { return this.value; }};
        }
        
        values.sort(function (a, b)
        {
            return b.value - a.value;
        });
        
        for (i = 0; i < len; i++)
        {
            if (defcut && values[i] * 360 / total <= 1.5)
            {
                cut = i;
                defcut = false;
            }
            
            if (i > cut) 
            {
                defcut = false;
                values[cut][0].value += values[i][0];
                values[cut][0].others = true;
                others = values[cut].value;
            }
        }
        
        len = Math.min(cut + 1, values.length);
        others && values.splice(len) && (values[cut][0].others = true);
              
        for (i = 0; i < len; i++)
        {
            var mangle = angle - 360 * values[i][0] / total / 2;
            if (!i)
            {
                angle = 90 - mangle;
                mangle = angle - 360 * values[i][0] / total / 2;
            }
            
            if (opts.init)
            {
                var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
            }
            
            var pathd;  //path object
            var ir, or; //inner and outer radius
            
            //value[x] consists of value itself and level
            /*if(values[i][1]==0)
            {
                pathd = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
            }   */
            
            ir = radpart*(values[i][1]);
            or = radpart*(values[i][1]+1);
                    
            pathd = ringsector(cx, cy, ir, or, angle, angle -= 360 * values[i][0] / total);
            
            //var p = this.path(opts.init ? ipath : path).attr({fill: opts.colors && opts.colors[i] || this.g.colors[i] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            //var p = this.path(path);
            //var hihi = this.path(path);
            //p.attr({fill: opts.colors && opts.colors[i] || this.g.colors[i] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            //p.value = values[i];
            //p.middle = path.middle;
            //p.mangle = mangle;
            sectors.push(pathd);
            series.push(pathd);
            //opts.init && p.animate({path: path.join(",")}, (+opts.init - 1) || 1000, ">");
        }
      
        
        /*for (i = 0; i < len; i++)
        {
            p = paper.path(sectors[i].attr("path")).attr(this.g.shim);
            opts.href && opts.href[i] && p.attr({href: opts.href[i]});
            p.attr = function () {};
            covers.push(p);
            series.push(p);
        }     */
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
    return chart;
};