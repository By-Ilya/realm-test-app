require('dotenv').config();

const SALESFORCE_URL = `${process.env.REACT_APP_SALESFORCE_URL}` || 'https://mongodb.my.salesforce.com';

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const valueAsUSD = (val) => {
  return formatter.format(val);
};

const generateSFLink = (id) => {
    return `${SALESFORCE_URL}/${id}`;
}


const consCodesMap = {
	"CONS-FOUND": "AF",
	"CONS-ARS-AZR":	"ARS",
	"CONS-FOUND-AWS": "AF",
	"CONS-UPGRD-AWS": "MVU",
	"CONS-HC": "HC",
	"CONS-RS-RLM-IOS": "RRS (iOS)",
	"CONS-D": "CPD",
	"CONS-DCE1/4":	"DCE 1/4",
	"CONS-ORS":	"ORS",
	"CONS-DCE1/2":	"DCE 1/2",
	"CONS-DCE":	"DCE",
	"CONS-PE":	"PE&T",
	"CONS-ARS":	"ARS",
	"CONS-UPGRD":	"MVU",
	"CONS-RS-RLM-AND":	"RRS (Android)",
	"CONS-CC-AZR":	"Flex",
	"CONS-D-AWS":	"CPD",
	"CONS-D-AZR":	"CPD",
	"CONS-ATLCM-CLDMP":	"ACM",
	"CONS-ENG-CARR": "PS3.0 arrears",
	"CONS-ATL-IGN":	"Atlas Ignite",
	"CONS-PRR":	"Prod Readiness",
	"CONS-PE-RLM":	"Realm AE&T",
	"CONS-D-CLDMP":	"CPD",
	"CONS-TM":	"CPD arrears",
	"CONS-RS":	"Dev Rapid Start",
	"CONS-ATLCM":	"ACM",
	"CONS-CUSTM-ARR":	"PS3.0 arrears",
	"CONS-CC-AWS":	"Flex",
	"CONS-CUSTM":	"PS3.0",
	"CONS-PE-AZR":	"PE&T",
	"CONS-UPGRD-AZR":	"MVU",
	"CONS-KUBR":	"Kub Readiness",
	"CONS-CC":	"Flex",
	"CONS-PE-AWS":	"PE&T",
	"CONS-RS-RLM-WEB":	"RRS (Web)",
	"CONS-ARS-AWS":	"ARS",
	"CONS-FOUND-AZR": "AF",
	//Training:
	"TRN-ADT-AWS":	"(T) 2-Day Advanced Dev",
	"TRN-PRI-ADM-AZR":	"(T) 3-Day Admin",
	"TRN-PRI-ONEATL-AWS":	"(T) 1-Day Atlas",
	"TRN-ADT-AZR":	"(T) 2-Day Advanced Dev",
	"TRN-PRI-DATA-AWS":	"(T) 3-Day Data Analysis",
	"TRN-PRI-ONEATL-AZR":	"(T) 1-Day Atlas",
	"TRN-PUB":	"(T) Public",
	"TRN-PRI-DT":	"(T) 3-Day Dev",
	"TRN-PRI-ADM":	"(T) 3-Day Admin",
	"TRN-AAT":	"(T) 2-Day Advanced Admin",
	"TRN-ADT":	"(T) 2-Day Advanced Dev",
	"TRN-PRI-ESS":	"(T) 4-Day Essentials",
	"TRN-PRI-AWS":	"(T) TPD",
	"TRAIN-ENG-CARR":	"(T) PS 3.0 arrears",
	"TRN-PRI":	"(T) TPD",
	"TRN-PRI-AZR":	"(T) TPD",
	"TRN-CUSTM":	"(T) PS 3.0",
	"TRN-CUSTM-ARR":	"(T) PS 3.0 arrears",
	"TRN-PRI-DT-AZR":	"(T) 3-Day Dev",
	"TRN-PRI-ONEATL":	"(T) 1-Day Atlas",
	"TRN-PRI-DT-AWS":	"(T) 3-Day Dev",
	"TRN-PRI-ESS-AZR":	"(T) 4-Day Essentials",
	"TRN-PRI-DATA":	"(T) 3-Day Data Analysis",
	"TRN-PRI-DATA-AZR":	"(T) 3-Day Data Analysis",
	"TRN-PRI-ADM-AWS":	"(T) 3-Day Admin",
	"TRN-PRI-ESS-AWS":	"(T) 4-Day Essentials",
}

const consCodeToProductAbbv = (code) => {
	return consCodesMap[code] ? consCodesMap[code] : code
}

module.exports = {
    valueAsUSD, generateSFLink,consCodeToProductAbbv
};