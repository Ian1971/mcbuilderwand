

cylinder_of_radius = function(r, h, direction){
    return {map:cylinder(r,h,direction), offset:{x:0,y:0,z:0}};

}

cone_of_radius = function(r, h, direction){
    return {map:cone(r,h,direction), offset:{x:0,y:0,z:0}};

}

// //xz plane circle at height y
circle = function(r, map, used, y, direction) {
    circleBres(r, map, used, y, direction) ;
    // let = h = 0      // x coordinate of circle center
    // let = k = 0      // y coordinate of circle center
    // let step = 2*Math.PI/(8*r);  // amount to add to theta each time (degrees)

    // for(let theta=0;  theta < 2*Math.PI;  theta+=step)
    // { 
    //     let x = h + r*Math.cos(theta);
    //     let z = k - r*Math.sin(theta);   
    //     let item = {x:x, y:y, z:z, col:1}; 

    //     push_to_map_axis(map, item, used, direction);
    // }

    // return map;
}

circleBres = function(r, map, used, y, direction) 
{ 
    let xc = 0, zc = 0;
    let x = 0, z = r; 
    let d = 3 - 2 * r; 
    drawCircle(xc, zc, x, z, map, used, y, direction); 
    while (z >= x) 
    { 
        // for each pixel we will 
        // draw all eight pixels 
          
        x++; 
  
        // check for decision parameter 
        // and correspondingly  
        // update d, x, y 
        if (d > 0) 
        { 
            z--;  
            d = d + 4 * (x - z) + 10; 
        } 
        else
            d = d + 4 * x + 6; 
        drawCircle(xc, zc, x, z, map, used, y, direction); 
    } 
} 

drawCircle = function(xc, zc, x, z, map, used, y, direction) 
{ 
    push_to_map_axis(map, {x:xc+x, y:y, z:zc+z, col:1}, used, direction);
    push_to_map_axis(map, {x:xc-x, y:y, z:zc+z, col:1}, used, direction);
    push_to_map_axis(map, {x:xc+x, y:y, z:zc-z, col:1}, used, direction);
    push_to_map_axis(map, {x:xc-x, y:y, z:zc-z, col:1}, used, direction);

    push_to_map_axis(map, {x:xc+z, y:y, z:zc+x, col:1}, used, direction);
    push_to_map_axis(map, {x:xc-z, y:y, z:zc+x, col:1}, used, direction);
    push_to_map_axis(map, {x:xc+z, y:y, z:zc-x, col:1}, used, direction);
    push_to_map_axis(map, {x:xc-z, y:y, z:zc-x, col:1}, used, direction);

} 

cylinder = function(r, h, direction) {
    let map = new Array();
    let used = {};

    //TODO: could make more efficient by calcing the circle once and replicating
    //if negative height then they went down. Remember that for later but flip sign of h
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }
    for (let y = 0; y < h; y++) {
        circle(r, map, used, sign * y, direction);
        
    }

    return map;
}

cone = function(r, h, direction) {
    let map = new Array();
    let used = {};

    //TODO: could make more efficient by calcing the circle once and replicating
    //if negative height then they went down. Remember that for later but flip sign of h
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }

    const coneStep = r / h ; //how much to decrease radius by each iteration

    for (let y = 0; y < h; y++) {
        if (r <= 0)
            break;
        circle(r, map, used, sign * y, direction);
        r -= coneStep;;
    }

    return map;
}
