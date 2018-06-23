
const General = require('../../core/General');
const Gender = require('../../core/Gender');
const Kingdom = require('../../core/Kingdom');

const generals = [];

let SunQuan = new General('sunquan', Kingdom.Wu, 4, Gender.Male);
generals.push(SunQuan);

let SunShangxiang = new General('sunshangxiang', Kingdom.Wu, 3, Gender.Female);
generals.push(SunShangxiang);

let ZhouYu = new General('zhouyu', Kingdom.Wu, 3, Gender.Male);
generals.push(ZhouYu);

let XiaoQiao = new General('xiaoqiao', Kingdom.Wu, 3, Gender.Female);
generals.push(XiaoQiao);

let DaQiao = new General('daqiao', Kingdom.Wu, 3, Gender.Female);
generals.push(DaQiao);

let LuXun = new General('luxun', Kingdom.Wu, 3, Gender.Male);
generals.push(LuXun);

let LuSu = new General('lusu', Kingdom.Wu, 3, Gender.Male);
generals.push(LuSu);

let SunJian = new General('sunjian', Kingdom.Wu, 4, Gender.Male);
generals.push(SunJian);

let TaishiCi = new General('taishici', Kingdom.Wu, 4, Gender.Male);
generals.push(TaishiCi);

let GanNing = new General('ganning', Kingdom.Wu, 4, Gender.Male);
generals.push(GanNing);

let HuangGai = new General('huanggai', Kingdom.Wu, 4, Gender.Male);
generals.push(HuangGai);

let DingFeng = new General('dingfeng', Kingdom.Wu, 4, Gender.Male);
generals.push(DingFeng);

let LvMeng = new General('lvmeng', Kingdom.Wu, 4, Gender.Male);
generals.push(LvMeng);

let ZhouTai = new General('zhoutai', Kingdom.Wu, 4, Gender.Male);
generals.push(ZhouTai);

let ZhangZhaoZhangHong = new General('zhangzhaozhanghong', Kingdom.Wu, 3, Gender.Male);
generals.push(ZhangZhaoZhangHong);

module.exports = generals;
