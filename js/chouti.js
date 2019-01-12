var PersonList = /** @class */ (function () {
    function PersonList(list) {
        this.personList = list;
    }
    PersonList.prototype.getPersonByIdCard = function (idCard) {
        var index = this.personList.findIndex(function (a) { return a.idCard === idCard; });
        if (index === -1) {
            return null;
        }
        else {
            return this.personList[index];
        }
        // return this.personList.find(a => a.idCard === idCard);
    };
    PersonList.prototype.addPerson = function (person) {
        // 如果已经在列表中则不再添加
        if (!this.hasInPersonList(person.idCard)) {
            this.personList.push(person);
            return person;
        }
        else {
            return null;
        }
    };
    PersonList.prototype.hasInPersonList = function (idCard) {
        return this.personList.findIndex(function (a) { return a.idCard === idCard; }) >= 0;
    };
    PersonList.prototype.changePersonInfo = function (person) {
        // 更改列表中的person信息
        var index = this.personList.findIndex(function (a) { return a.idCard === person.idCard; });
        if (index === -1) {
            return false;
        }
        else {
            this.personList[index].changePersonInfo(person.idCard, person.zhunkaoZheng, person.name);
        }
    };
    PersonList.prototype.setPersonTimu = function (person, timu1, timu2, timu3) {
        var index = this.personList.findIndex(function (a) { return a.idCard === person.idCard; });
        if (index === -1) {
            return false;
        }
        else {
            this.personList[index].setTimu(timu1, timu2, timu3);
            return true;
        }
    };
    return PersonList;
}());
var Person = /** @class */ (function () {
    function Person(idCard, zhunkaoZheng, name) {
        this.signed = false;
        this.idCard = idCard;
        this.zhunkaoZheng = zhunkaoZheng;
        this.name = name;
        this.timu1 = '0';
        this.timu2 = '0';
        this.timu3 = '0';
        this.signed = false;
        // this.signedDate = new Date()
    }
    Person.prototype.changePersonInfo = function (idCard, zhunkaoZheng, name) {
        this.idCard = idCard;
        this.zhunkaoZheng = zhunkaoZheng;
        this.name = name;
    };
    Person.prototype.setTimu = function (timu1, timu2, timu3) {
        this.timu1 = timu1;
        this.timu2 = timu2;
        this.timu3 = timu3;
        this.signedDate = new Date();
        this.signed = true;
    };
    Person.prototype.hasSigned = function () {
        return this.signed;
    };
    return Person;
}());
var TiKu = /** @class */ (function () {
    function TiKu(min, max, limitNumber) {
        this.minNumber = min;
        this.maxNumber = max;
        this.limitNumber = limitNumber;
        this.blackList = [0];
        this.numberCount = [new NumberCount(0)];
    }
    TiKu.prototype.GetTiMu = function () {
        // 通过算法获得题目
        // 保证抽取的题目能够合理分布，比如题组是1-50，有100个人抽，则出现2号题组号的人为2个。
        // 限制的数量为 100/50=2次 (向上取整，如果是101，则为3次)
        // 当限制数达到上限时，加入到黑名单，不能再出现该题
        // 先抽取一个题，看是否在黑名单 中，如果没在，则为有效，将该值的引用加1，如果该值的引用数超过限制数，则加入到黑名单 。如果在黑名单中，继续抽题
        //    let result = this.getRandomIntWithRange(this.minNumber, this.maxNumber)
        var result = 0;
        var selectNum = 0;
        while (this.blackList.length > 0 && selectNum <= 1000 && this.hasInBlackList(result)) {
            result = this.getRandomIntWithRange(this.minNumber, this.maxNumber);
            selectNum++;
            if (selectNum > 1000) {
                // 说明所有的题库池已经用完
                this.limitNumber++;
                // 清空blackList
                this.blackList = [0];
            }
            else {
                // 添加到numberCount
                this.addNumberCount(result);
            }
        }
        return result;
    };
    TiKu.prototype.hasInBlackList = function (num) {
        var result = this.blackList.findIndex(function (a) { return a === num; }) > -1;
        return result;
    };
    TiKu.prototype.getRandomIntWithRange = function (min, max) {
        var w = max - min;
        var p = Math.random() * w;
        var result = Math.round(p + min);
        return result;
    };
    TiKu.prototype.addNumberCount = function (num) {
        var index = this.numberCount.findIndex(function (a) { return a.num === num; });
        if (index === -1) {
            this.numberCount.push(new NumberCount(num));
        }
        else {
            // 如果count大于等于limitNumber，则添加到blackList
            if (this.numberCount[index].count >= this.limitNumber) {
                if (!this.hasInBlackList(this.numberCount[index].num)) {
                    this.blackList.push(this.numberCount[index].num);
                }
            }
            else {
                this.numberCount[index].AddCount();
            }
        }
    };
    return TiKu;
}());
var NumberCount = /** @class */ (function () {
    function NumberCount(initNum) {
        this.num = initNum;
        this.count = 1;
    }
    NumberCount.prototype.AddCount = function () {
        this.count++;
    };
    return NumberCount;
}());
