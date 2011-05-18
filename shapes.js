Raphael.prototype.circlepath = function(x, y, r, steps) {
    // start at top center

    if(steps===undefined)
        steps=256;

    var start_x = parseInt(x-r);
    var start_y = parseInt(y);

    var path = [];
    path.push('M'+x+' '+(y+r));

    var circ = 2*Math.PI;

    inc = circ/steps;

    for(var i=0;i<circ;i+=inc) {
        path.push('L'+(x+Math.sin(i)*r));
        path.push(' '+(y+Math.cos(i)*r));
    }
    path.push('Z');

    return path.join('');
};

Raphael.prototype.rectpath = function(x,y,a,b,steps) {
    var path = [];
    if(steps==undefined)
        steps=256;

    var altogether = 2*a+2*b;
    var inc = altogether/steps;

    var start_x = x-a/2;
    var start_y = y-b/2;

    path.push('M'+(start_x+a/2)+' '+(start_y+b));
    
    for(var i=a/2;i<a;i+=inc) {
        path.push('L'+(start_x+i)+' '+(start_y+b));
    }
    for(var i=b;i>0;i-=inc) {
        path.push('L'+(start_x+a)+' '+(start_y+i));
    }
    for(var i=a;i>0;i-=inc) {
        path.push('L'+(start_x+i)+' '+start_y);
    }
    for(var i=b;i>0;i-=inc) {
        path.push('L'+(start_x)+' '+(start_y+b-i));
    }
    for(var i=0;i<a/2;i+=inc) {
        path.push('L'+(start_x+i)+' '+(start_y+b));
    }
    path.push('Z');
    return path.join('');
}
Raphael.prototype.sectionpath = function(x, y, rad, ang1, ang2, steps) {
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

Raphael.prototype.ringsectionpath = function(x, y, rad1, rad2, ang1, ang2, steps) {
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
};
