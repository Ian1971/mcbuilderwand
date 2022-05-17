// /https://www.geeksforgeeks.org/bresenhams-algorithm-for-3-d-line-drawing/

//wall between two points where the direction axis is fixed for the line
wall = function(startPos, endPos, direction) {
    let map = new Array();
    let used = {};

    let h = Math.floor(endPos.y) - Math.floor(startPos.y);
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }
    for (let y = 0; y < h; y++) {
        doline3D(startPos.x, sign * y, startPos.z, endPos.x, sign * y, endPos.z, direction, map, used);
    }

    return {map:map, offset:{x:0,y:-startPos.y,z:0}};

}

//line between two points in 3d
line3D = function(startPos, endPos) {
    let map = new Array();
    let used = {};

    doline3D(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, "y", map, used);

    return {map:map, offset:{x:0,y:0,z:0}};
}

doline3D = function(x1, y1, z1, x2, y2, z2, direction, map, used) {
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);
    z1 = Math.floor(z1);
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
    z2 = Math.floor(z2);

    push_to_map_axis(map, {x:x1, y:y1, z:z1, col:1}, used, direction);
    let dx = Math.abs(x2 - x1) ;
    let dy = Math.abs(y2 - y1) ;
    let dz = Math.abs(z2 - z1) ;
    let xs,ys,zs;

    if (x2 > x1)
        xs = 1;
    else
        xs = -1;

    if (y2 > y1)
        ys = 1;
    else
        ys = -1;

    if (z2 > z1)
        zs = 1;
    else
        zs = -1;
    
    //Driving axis is X-axis
    if (dx >= dy && dx >= dz){
        p1 = 2 * dy - dx ;
        p2 = 2 * dz - dx ;
        while (x1 != x2) {
            x1 += xs ;
            if (p1 >= 0) {
                y1 += ys ;
                p1 -= 2 * dx ;
            }

            if (p2 >= 0){
                z1 += zs ;
                p2 -= 2 * dx;
            }
 
            p1 += 2 * dy ;
            p2 += 2 * dz ;
            push_to_map_axis(map, {x:x1, y:y1, z:z1, col:1}, used, direction);
        } 

    }      
    //Driving axis is Y-axis
    else if (dy >= dx && dy >= dz){
        p1 = 2 * dx - dy ;
        p2 = 2 * dz - dy ;
        while (y1 != y2) {
            y1 += ys ;
            if (p1 >= 0) {
                x1 += xs ;
                p1 -= 2 * dy ;
            }

            if (p2 >= 0) {
                z1 += zs ;
                p2 -= 2 * dy ;
            }

            p1 += 2 * dx ;
            p2 += 2 * dz ;
            push_to_map_axis(map, {x:x1, y:y1, z:z1, col:1}, used, direction);
        }

    }       
    //Driving axis is Z-axis
    else {
        p1 = 2 * dy - dz ;
        p2 = 2 * dx - dz ;
        while (z1 != z2) {
            z1 += zs ;
            if (p1 >= 0){
                y1 += ys ;
                p1 -= 2 * dz ;
            }

            if (p2 >= 0){
                x1 += xs ;
                p2 -= 2 * dz ;
            }

            p1 += 2 * dy ;
            p2 += 2 * dx ;
            push_to_map_axis(map, {x:x1, y:y1, z:z1, col:1}, used, direction);
        }

    }      
       
    return {map:map, offset:{x:0,y:0,z:0}};
}