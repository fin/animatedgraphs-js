Raphael.prototype.piechart = function(x, y, rad, ang1, ang2, steps) {
    // start at tip (0,0), go to angle1 (0° = east), go ccw to angle2 and back to tip

    if(steps===undefined)
        steps=1024;
 
    var steps1 = Math.floor(parseInt(steps)/3); //steps for lines to tip
    var steps2 = steps1 + parseInt(steps) % 3;  //steps for arc
    var p1x = x + rad * Math.cos(ang1);
    var p1y = y + rad * Math.sin(ang1);
    var p2x = x + rad * Math.cos(ang2);
    var p2y = y - rad * Math.sin(ang2);
    var angdiff = ang2 - ang1;

    console.log(steps1);
    console.log(steps2);

    //create path
    var path = [];
    path.push('M'+x+' '+y); //tip

    //path part 1: tip to arc starting point
    var t1x = (p1x-x)/steps1;
    var t1y = (p1y-y)/steps1; 
    for(var i=1; i<=steps1; i+=1) {
        path.push('L'+(x+(t1x*i))+' '+(y+(t1y*i)));
    }
    
    //path part 2: arc
    var tang = angdiff/steps2;
    for(var i=1; i<=steps2; i+=1) {
        path.push('L'+(x+rad*Math.cos(ang1+i*tang)));
        path.push(' '+(y-rad*Math.sin(ang1+i*tang)));
    }
    
    //path part 3: arc end point to tip
    var t2x = (x-p2x)/steps1;
    var t2y = (y-p2y)/steps1; 
    for(var i=steps1; i>=1; i-=1) {
        path.push('L'+(p2x+(t2x*i))+' '+(p2y+(t2y*i)));
    }

    path.push('Z');

    return path.join('');
};
