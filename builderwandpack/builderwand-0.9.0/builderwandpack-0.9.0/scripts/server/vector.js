
vectorAToB = function(startPos, endPos) {

    return {x:endPos.x - startPos.x, y:endPos.y - startPos.y, z:endPos.z - startPos.z };

}

magnitude = function(vector){
    return Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
}

magnitude2d = function(x,y){
    return Math.sqrt(x*x + y*y);
}

push_to_map = function(map, item, used) {
    //check we don't already have it
    const posid = item.x + "|" + item.y + "|" + item.z;

    if (used[posid])
    {
        // log("used", posid);
        return;
    }

    used[posid] = true;

    map.push(item);
}


push_to_map_axis = function(map, item, used, axis) {
    if (axis === "x")  {
        push_to_map(map,{x:item.y, y:Math.round(item.x), z:Math.round(item.z), col:1},used);
    }
    else if (axis === "z")  {
        push_to_map(map,{x:Math.round(item.x), y:Math.round(item.z), z:-item.y, col:1},used);
    }
    else{
        push_to_map(map,{x:Math.round(item.x), y:item.y, z:Math.round(item.z), col:1},used);
    }  
}