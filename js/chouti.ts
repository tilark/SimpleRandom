class PersonList {
    personList: Array<Person>;
    constructor(list:Person[]) {
        this.personList = list;
    }
    getPersonByIdCard(idCard:string) {
        let index = this.personList.findIndex(a => a.idCard === idCard)
        if(index === -1){
            return null
        } else {
            return this.personList[index]
        }
        // return this.personList.find(a => a.idCard === idCard);
    }
    addPerson(person: Person){
        // 如果已经在列表中则不再添加
        if(!this.hasInPersonList(person.idCard)) {
            this.personList.push(person)
            return person
        }
        else {
            return null
        }        
    }
    hasInPersonList(idCard: string) {
        return this.personList.findIndex(a => a.idCard === idCard) >= 0
    }
    changePersonInfo(person: Person){
        // 更改列表中的person信息
        let index = this.personList.findIndex(a => a.idCard === person.idCard)
        if(index === -1){
            return false
        } else {           
            this.personList[index].changePersonInfo(person.idCard, person.zhunkaoZheng, person.name)
        }
    }  
    setPersonTimu(person: Person, timu1: string, timu2: string, timu3: string){
        let index = this.personList.findIndex(a => a.idCard === person.idCard)
        if(index === -1){
            return false
        } else {         
            
            this.personList[index].setTimu(timu1, timu2, timu3)
            return true
        }
    }  
}

class Person {
    idCard: string;
    zhunkaoZheng: string;
    name: string;
    timu1: string;
    timu2: string;
    timu3: string;
    singed: boolean = false;
    signedDate: string;
    constructor(idCard:string, zhunkaoZheng:string, name: string) {
        this.idCard = idCard;
        this.zhunkaoZheng = zhunkaoZheng;
        this.name = name;
        this.timu1 = '0'
        this.timu2 = '0'
        this.timu3 = '0'
    }
    changePersonInfo(idCard:string, zhunkaoZheng: string, name: string) {
        this.idCard = idCard
        this.zhunkaoZheng = zhunkaoZheng
        this.name = name
    }
    setTimu(timu1: string, timu2: string, timu3: string){
        this.timu1 = timu1
        this.timu2 = timu2
        this.timu3 = timu3
        this.singed = true
    }
    hasSigned() {
        return this.singed
    }
}

class TiKu {
    blackList: number[];
    numberCount: NumberCount[];
    minNumber: number;
    maxNumber: number;
    limitNumber: number;
    constructor(min:number, max:number, limitNumber: number) {
        this.minNumber = min;
        this.maxNumber = max;
        this.limitNumber = limitNumber;
        this.blackList = [0]
        this.numberCount =  [new NumberCount(0)]
    }
    GetTiMu() {
        // 通过算法获得题目
        // 保证抽取的题目能够合理分布，比如题组是1-50，有100个人抽，则出现2号题组号的人为2个。
        // 限制的数量为 100/50=2次 (向上取整，如果是101，则为3次)
        // 当限制数达到上限时，加入到黑名单，不能再出现该题
        // 先抽取一个题，看是否在黑名单 中，如果没在，则为有效，将该值的引用加1，如果该值的引用数超过限制数，则加入到黑名单 。如果在黑名单中，继续抽题
    //    let result = this.getRandomIntWithRange(this.minNumber, this.maxNumber)
        let result = 0
       let selectNum = 0;
        while(this.blackList.length > 0 && selectNum <= 1000 && this.hasInBlackList(result)){
            result = this.getRandomIntWithRange(this.minNumber, this.maxNumber)
            selectNum++
            if(selectNum > 1000) {
                // 说明所有的题库池已经用完
                this.limitNumber++
                // 清空blackList
                this.blackList = [0]
            } else {
                // 添加到numberCount
                this.addNumberCount(result)                
            }
        }
        return result
    }   
    private hasInBlackList(num:number) {
        const result = this.blackList.findIndex(a => a === num) > -1
        return result
    }
    private getRandomIntWithRange(min, max) {
        let w = max - min
            let p = Math.random() * w
            let result = Math.round(p + min)
            return result
    }  
    private addNumberCount(num:number) {
        let index = this.numberCount.findIndex(a => a.num === num);
        if(index === -1){
            this.numberCount.push(new NumberCount(num))
        } else {            
            // 如果count大于等于limitNumber，则添加到blackList
            if(this.numberCount[index].count >= this.limitNumber) {
                if(!this.hasInBlackList(this.numberCount[index].num)) {
                    this.blackList.push(this.numberCount[index].num)
                }
            } else {
                this.numberCount[index].AddCount()
            }
        }
    }
}


class NumberCount {
    num: number;
    count: number;
    constructor(initNum:number){
        this.num = initNum;
        this.count = 1
    }
    AddCount() {
        this.count ++;
    }
}