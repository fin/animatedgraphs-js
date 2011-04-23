Raphael.prototype.piechart = function(x, y, rad, ang1, ang2, steps) {
    // start at tip (x,y), go to angle1 (0° = east), go ccw to angle2 and back to tip

    if(steps===undefined)
        steps=1024;
 
    ang1 *= Math.PI/180; //convert deg to rad
    ang2 *= Math.PI/180;
    
    var steps1 = Math.floor(parseInt(steps)/3); //steps for lines to tip
    var steps2 = steps1 + parseInt(steps) % 3;  //steps for arc
    var p1x = x + rad * Math.cos(ang1);
    var p1y = y - rad * Math.sin(ang1);
    var p2x = x + rad * Math.cos(ang2);
    var p2y = y - rad * Math.sin(ang2);
    var angdiff = ang2 - ang1;

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
    for(var i=1; i<steps1; i+=1) {
        path.push('L'+(p2x+(t2x*i))+' '+(p2y+(t2y*i)));
    }

    //close path
    path.push('Z');

    return path.join('');
};

Raphael.prototype.ringchart = function(x, y, rad1, rad2, ang1, ang2, steps) {
    /* draw an arc segment with given inner radius rad1 and outer radius rad2.
       start in the middle of the inner arc, go to angle1 (0° = east), 
       go to the outer arc, go ccw to angle2 and back to the inner arc. */

    if(steps===undefined)
        steps=1024;
 
    ang1 *= Math.PI/180; //convert deg to rad
    ang2 *= Math.PI/180;
    
    //create variables
    var steps1 = Math.floor(parseInt(steps)/4); //steps for straight lines and inner arc
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
    steps1f = Math.floor(steps1/2);
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
    var tang = angdiff/steps2;
    for(var i=1; i<=steps2; i+=1) {
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
    steps1c = Math.ceil(steps1/2);
    var tang = angdiff2/steps1c;
    for(var i=1; i<steps1c; i+=1) {
        path.push('L'+(x+rad1*Math.cos(ang2-i*tang)));
        path.push(' '+(y-rad1*Math.sin(ang2-i*tang)));
    }

    //close path
    path.push('Z');

    return path.join('');
};
