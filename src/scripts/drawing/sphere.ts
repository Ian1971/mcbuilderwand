import { Block, BlockLocation, Player } from "mojang-minecraft";
import * as vector from "./vector";
import {Action} from "./../action"
import {PlayerWandState} from "./../playerwandstate"
import * as logging from "./../logging"
import { MapWithOffset} from "./vector";

export class Sphere extends Action {

    constructor()
    {
    super("sphere", false, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset 
    {
        const dir = vector.vectorAToB(wandState.firstPosition, wandState.secondPosition);
        const radius = Math.round(vector.magnitude(dir));
    
        let map = sphere_of_radius(radius);

        return map;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a sphere using ${wandState.firstBlock}`);
        logging.log(`The first click choose the center.`);
        logging.log(`The second click defines the radius.`);
    }
}

 function sphere_of_radius(r:number):MapWithOffset
 {
    const a = r + 3;
    const n = a << 1;

    return new MapWithOffset(sphere(a,a,a,r,1,n), new BlockLocation(a,a,a));
}

export function hemisphere_of_radius(r:number):MapWithOffset
{
    const a = r + 3;
    const n = a << 1;

    return new MapWithOffset(sphere(a,0,a,r,1,n), new BlockLocation(a,0,a));
}
 

//draw sphere centered x0,y0,z0 of radius r, constrained in box of size n
function sphere( x0:number, y0:number, z0:number, r:number, col:number, n:number):Array<BlockLocation>
{
    let map = new Array<BlockLocation>();
    let used = new Map<string, boolean>();

    let x:number,y:number = 0,z:number = 0,xa:number,ya:number,za:number,xb:number,yb:number,zb:number,xr:number,yr:number,zr:number,xx:number,yy:number,zz:number,rr:number=r*r;

    // bounding box
    xa=x0-r; if (xa<0) xa=0; xb=x0+r; if (xb>n) xb=n;
    ya=y0-r; if (ya<0) ya=0; yb=y0+r; if (yb>n) yb=n;
    za=z0-r; if (za<0) za=0; zb=z0+r; if (zb>n) zb=n;

    // project xy plane
    for (x=xa,xr=x-x0,xx=xr*xr;x<xb;x++,xr++,xx=xr*xr)
     for (y=ya,yr=y-y0,yy=yr*yr;y<yb;y++,yr++,yy=yr*yr)
        {
        zz=rr-xx-yy; if (zz<0) continue; zr=Math.sqrt(zz);

        z=Math.round(z0-zr); if ((z>0)&&(z<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        z=Math.round(z0+zr); if ((z>0)&&(z<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        }
    // project xz plane
    for (x=xa,xr=x-x0,xx=xr*xr;x<xb;x++,xr++,xx=xr*xr)
     for (z=za,zr=z-z0,zz=zr*zr;z<zb;z++,zr++,zz=zr*zr)
        {
        yy=rr-xx-zz; if (yy<0) continue; yr=Math.sqrt(yy);

        y=Math.round(y0-yr); if ((y>0)&&(y<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        y=Math.round(y0+yr); if ((y>0)&&(y<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        }
    // project yz plane
    for (y=ya,yr=y-y0,yy=yr*yr;y<yb;y++,yr++,yy=yr*yr)
     for (z=za,zr=z-z0,zz=zr*zr;z<zb;z++,zr++,zz=zr*zr)
        {
        xx=rr-zz-yy; if (xx<0) continue; xr=Math.sqrt(xx);

        x=Math.round(x0-xr); if ((x>0)&&(x<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        x=Math.round(x0+xr); if ((x>0)&&(x<n)) vector.push_to_map(map,new BlockLocation(x,y,z),used);
        }

    return map;
}



