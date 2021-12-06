
sphere_of_radius = function(r){
    const a = r + 3;
    n = a << 1;

    return {map:sphere(a,a,a,r,1,n), offset:{x:a,y:a,z:a}};
}

hemisphere_of_radius = function(r){
    const a = r + 3;
    n = a << 1;

    return {map:sphere(a,0,a,r,1,n), offset:{x:a,y:0,z:a}};
}

//draw sphere centered x0,y0,z0 of radius r, constrained in box of size n
sphere = function( x0, y0, z0, r, col, n) {
    let map = new Array();
    let used = {};

    let x,y,z,xa,ya,za,xb,yb,zb,xr,yr,zr,xx,yy,zz,rr=r*r;

    // bounding box
    xa=x0-r; if (xa<0) xa=0; xb=x0+r; if (xb>n) xb=n;
    ya=y0-r; if (ya<0) ya=0; yb=y0+r; if (yb>n) yb=n;
    za=z0-r; if (za<0) za=0; zb=z0+r; if (zb>n) zb=n;

    // project xy plane
    for (x=xa,xr=x-x0,xx=xr*xr;x<xb;x++,xr++,xx=xr*xr)
     for (y=ya,yr=y-y0,yy=yr*yr;y<yb;y++,yr++,yy=yr*yr)
        {
        zz=rr-xx-yy; if (zz<0) continue; zr=Math.sqrt(zz);
        z=Math.round(z0-zr); if ((z>0)&&(z<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        z=Math.round(z0+zr); if ((z>0)&&(z<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        }
    // project xz plane
    for (x=xa,xr=x-x0,xx=xr*xr;x<xb;x++,xr++,xx=xr*xr)
     for (z=za,zr=z-z0,zz=zr*zr;z<zb;z++,zr++,zz=zr*zr)
        {
        yy=rr-xx-zz; if (yy<0) continue; yr=Math.sqrt(yy);
        y=Math.round(y0-yr); if ((y>0)&&(y<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        y=Math.round(y0+yr); if ((y>0)&&(y<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        }
    // project yz plane
    for (y=ya,yr=y-y0,yy=yr*yr;y<yb;y++,yr++,yy=yr*yr)
     for (z=za,zr=z-z0,zz=zr*zr;z<zb;z++,zr++,zz=zr*zr)
        {
        xx=rr-zz-yy; if (xx<0) continue; xr=Math.sqrt(xx);
        x=Math.round(x0-xr); if ((x>0)&&(x<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        x=Math.round(x0+xr); if ((x>0)&&(x<n)) push_to_map(map,{x:x, y:y, z:z, col:col},used);
        }

    return map;
}



