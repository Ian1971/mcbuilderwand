const woodVariant = {};
woodVariant["oak"] = 0;
woodVariant["spruce"] = 1;
woodVariant["birch"] = 2;
woodVariant["jungle"] = 3;
woodVariant["acacia"] = 4;
woodVariant["dark_oak"] = 5;

getWoodVariant = function(type) {
    return woodVariant[type];
}

const colorVariant = {};
colorVariant["white"] = 0;
colorVariant["orange"] = 1;
colorVariant["magenta"] = 2;
colorVariant["light_blue"] = 3;
colorVariant["yellow"] = 4;
colorVariant["lime"] = 5;
colorVariant["pink"] = 6;
colorVariant["gray"] = 7;
colorVariant["silver"] = 8;
colorVariant["cyan"] = 9;
colorVariant["purple"] = 10;
colorVariant["blue"] = 11;
colorVariant["brown"] = 12;
colorVariant["green"] = 13;
colorVariant["red"] = 14;
colorVariant["black"] = 15;

getColorVariant = function(type) {
    return colorVariant[type];
}

const oldLeafVariant = {};
oldLeafVariant["oak"] = 0;
oldLeafVariant["spruce"] = 1;
oldLeafVariant["birch"] = 2;
oldLeafVariant["jungle"] = 3;

getOldLeafVariant = function(type) {
    return oldLeafVariant[type];
}


const newLeafVariant = {};
newLeafVariant["acacia"] = 0;
newLeafVariant["dark_oak"] = 1;

getNewLeafVariant = function(type) {
    return newLeafVariant[type];
}