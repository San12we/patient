type onBoardingSlidingTypes = {
    color: string;
    title: string;
    description: string;
    image: any;
    subTitle: string;
};

interface Professional {
    _id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    profileImage?: string;
    clinicName: string;
    clinicAddress: string;
    clinicInsurances: string[];
}

interface Clinic {
    _id: string;
    name: string;
    address: string;
    insuranceCompanies: string[];
    professionals?: Professional[];
    clinicImages?: string[];
}