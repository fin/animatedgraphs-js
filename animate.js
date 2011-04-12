Raphael.prototype.circlepath = function(x, y, r, steps) {
    // start at top center

    if(steps===undefined)
        steps=1024;

    var start_x = parseInt(x-r);
    var start_y = parseInt(y);

    console.log(start_x);
    console.log(start_y);

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
        steps=1024;

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
