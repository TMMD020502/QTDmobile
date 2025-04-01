import {ImageRequireSource} from 'react-native';

type IconCategory = {
  [key: string]: ImageRequireSource;
};

interface IconGroups {
  navigation: IconCategory;
  action: IconCategory;
  qr: IconCategory;
  form: IconCategory;
  feature: IconCategory;
  media: IconCategory;
}

const icons: IconGroups = {
  navigation: {
    home: require('../../assets/images/home-icon.png'),
    save: require('../../assets/images/save-icon.png'),
    loan: require('../../assets/images/loan-icon.png'),
    rate: require('../../assets/images/rate-icon.png'),
    settings: require('../../assets/images/setting-icon.png'),
  },
  action: {
    back: require('../../assets/images/arrow-left.png'),
    next: require('../../assets/images/arrow-right.png'),
    add: require('../../assets/images/add-icon.png'),
    downLoad: require('../../assets/images/download-icon.png'),
    upLoad: require('../../assets/images/upload-icon.png'),
    copy: require('../../assets/images/copy-icon.png'),
    sent: require('../../assets/images/sent-icon.png'),
    chevronUp: require('../../assets/images/chevron-up.png'),
    chevronDown: require('../../assets/images/chevron-down.png'),
    logOut: require('../../assets/images/logout-icon.png'),
    depositIcon: require('../../assets/images/deposit-icon.png'),
    withdrawIcon: require('../../assets/images/withdraw-icon.png'),
    transactionIcon: require('../../assets/images/transaction-icon.png'),
    supportIcon: require('../../assets/images/support-icon.png'),
    infoIcon: require('../../assets/images/info-icon.png'),
    closeIcon: require('../../assets/images/close-icon.png'),
    linkingBankIcon: require('../../assets/images/linking-bank.png'),
    servicesIcon: require('../../assets/images/services.png'),
    searchIcon: require('../../assets/images/search-icon.png'),
    waterIcon: require('../../assets/images/water-icon.png'),
    electricityIcon: require('../../assets/images/electricity-icon.png'),
    internetIcon: require('../../assets/images/internet-icon.png'),
    insuranceIcon: require('../../assets/images/insurance-icon.png'),
    educationIcon: require('../../assets/images/education-icon.png'),
    promotionsIcon: require('../../assets/images/promotions-icon.png'),
  },
  qr: {
    qr: require('../../assets/images/QR.jpg'),
    tpBank: require('../../assets/images/icon-TPBank.png'),
    BIDV: require('../../assets/images/icon-BIDV.png'),
    vcb: require('../../assets/images/icon-vcb.png'),
    mbb: require('../../assets/images/icon-mbb.png'),
    vpb: require('../../assets/images/icon-vpb.png'),
    acb: require('../../assets/images/icon-acb.png'),
    tcb: require('../../assets/images/icon-tcb.png'),
    agr: require('../../assets/images/icon-agr.png'),
    stb: require('../../assets/images/icon-stb.png'),
    hdb: require('../../assets/images/icon-hdb.png'),
    ctg: require('../../assets/images/icon-ctg.png'),
    msb: require('../../assets/images/icon-msb.png'),
    shb: require('../../assets/images/icon-shb.png'),
    seab: require('../../assets/images/icon-seab.png'),
    namab: require('../../assets/images/icon-namab.png'),
    viettelIcon: require('../../assets/images/viettel-icon.png'),
    mobifoneIcon: require('../../assets/images/mobifone-icon.png'),
    vinaphoneIcon: require('../../assets/images/vinaphone-icon.png'),
    vietnamobileIcon: require('../../assets/images/vietnamobile-icon.png'),
    waterThuDuc: require('../../assets/images/nc-thuduc.png'),
    waterBenThanh: require('../../assets/images/nc-benthanh.png'),
    waterCanGio: require('../../assets/images/nc-cangio.png'),
    waterGiaDinh: require('../../assets/images/nc-giadinh.png'),
    waterPhuHoaTan: require('../../assets/images/nc-phuhoatan.png'),
    waterTanHoa: require('../../assets/images/nc-tanhoa.png'),
    evn: require('../../assets/images/evn.png'),
    viettelTele: require('../../assets/images/viettel-tele.png'),
    fpt: require('../../assets/images/fpt.png'),
    vnpt: require('../../assets/images/vnpt.png'),
  },
  form: {
    email: require('../../assets/images/email-icon.png'),
    password: require('../../assets/images/password-icon.png'),
    phone: require('../../assets/images/phone-icon.png'),
    eyesOpen: require('../../assets/images/eyes-icon.png'),
    eyesClose: require('../../assets/images/eyesclose-icon.png'),
    location: require('../../assets/images/location-icon.png'),
  },
  feature: {
    saveSent: require('../../assets/images/save-sent-icon.png'),
    notification: require('../../assets/images/notification-icon.png'),
    message: require('../../assets/images/message-icon.png'),
  },
  media: {
    avatar: require('../../assets/images/avatar.jpg'),
    banner: require('../../assets/images/banner.jpg'),
  },
};

// Flatten icons object for backward compatibility
export const AppIcons = Object.entries(icons).reduce(
  (acc, [_, value]) => ({
    ...acc,
    ...value,
  }),
  {},
) as Record<string, ImageRequireSource>;

// Export grouped icons for better organization if needed
export const Icons = icons;
