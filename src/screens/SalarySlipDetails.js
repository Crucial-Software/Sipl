import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, PermissionsAndroid, Image, ActivityIndicator } from 'react-native'
import { Colors, Fonts, FontSize } from '../common/ConstantStyles';
import Snackbar from 'react-native-snackbar';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';


const SalarySlipDetails = ({ navigation, route }) => {

    const { salarySlipId } = route.params;

    const [loading, setLoading] = useState(false);
    const [salarySlipDetails, setSalarySlipDetails] = useState([]);
    const [myPdfUri, setMyPdfUri] = useState("");
    const [randomInvoiceNumber, setRandomInvoiceNumber] = useState("");

    useEffect(() => {

        setLoading(false);

        generateRandomNumber(5);

        //getSalarySlipDetails();

    }, []);

    const getSalarySlipDetails = async () => {

        try {
            const response = await fetch(`${API_BASE}/api/category.php`);
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            setSalarySlipDetails(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    const generateRandomNumber = (len) => {
        const char = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
        const random = Array.from({ length: len }, () => char[Math.floor(Math.random() * char.length)]);
        const randomString = random.join("");
        //console.log("randomString: " + randomString);
        setRandomInvoiceNumber(randomString);
    }

    const askPermission = () => {

        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'SIPL Needs External Storage Write Permission',
                        message: 'SIPL needs access to storage data in your SD Card',
                    }
                );

                console.log("Permission: " + granted);

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    createPDF();
                } else {
                    Snackbar.show({ text: 'Permission Denied', duration: Snackbar.LENGTH_SHORT })
                }
            } catch (err) {
                Snackbar.show({ text: 'Error Occured. Please try again.', duration: Snackbar.LENGTH_SHORT })
                console.warn(err);
            }
        }
        if (Platform.OS === 'android') {
            requestExternalWritePermission();
        } else {
            createPDF();
        }
    }

    const createPDF = async () => {

        setLoading(true);
        let options = {
            html: htmlContent,
            fileName: `SalarySlip-${randomInvoiceNumber}`,
            directory: 'Download',
            base64: true
        };

        let file = await RNHTMLtoPDF.convert(options)
        console.log("file.filepath: " + file.filePath);
        setMyPdfUri(file.filePath);
        setLoading(false);

    }

    const downloadSalarySlipPDF = () => {

        var RNFS = require('react-native-fs');
        console.log("Path: " + RNFS.DownloadDirectoryPath);

        const destinationFile = RNFS.DownloadDirectoryPath + "/" + `SalarySlip-${randomInvoiceNumber}.pdf`;
        console.log("destinationFile: " + destinationFile);

        RNFS.copyFile(myPdfUri, destinationFile)
            .then(result => {
                console.log("Copied file");
                Snackbar.show({ text: 'Salary Slip Downloaded. Please check downloads folder.', duration: Snackbar.LENGTH_SHORT })
            })
            .catch(err => {
                console.log('err', err);
                Snackbar.show({ text: 'Error Occured. Please try again.', duration: Snackbar.LENGTH_SHORT })
            });
    }

    let imageLocalPath = require('../assets/images/sipl_logo-transparantbg.png');

    const htmlContent = `

        <html>
        
          <head>
            <meta charset="utf-8">
            <style>
              ${htmlStyles}
            </style>
          </head>

          <body>

            <h2>
                <img src="https://shrikarniinfra.in/assets/logo.png" height="75" width="90" style="margin: 0 10px 10px 0;" align="middle" >
                ShriKarni Infratech Pvt. Ltd.
            </h2>

            <table style="width:100%">
               
                <tr>
                    <th colspan="4">Salary Slip for Sep 2023</th>
                </tr>
                
                <tr>
                    <td>Name:</td>
                    <td style="border-right: 1px solid black;">Siddharajsinh Jadeja</td>
                    <td>Location:</td>
                    <td>Ahmedabad</td>
                </tr>
                
                <tr>
                    <td>Emp.No:</td>
                    <td style="border-right: 1px solid black;">EMP001</td>
                    <td>Bank Name:</td>
                    <td>SBI Bank</td>
                </tr>
                
                <tr>
                    <td>Designation:</td>
                    <td style="border-right: 1px solid black;">Store Supervisor</td>
                    <td>A/c No.:</td>
                    <td>ACC111222333444555</td>
                </tr>
                
                <tr>
                    <th colspan="2">Earnings</th>
                    <th colspan="2">Deductions</th>
                </tr>
                
                <tr>
                    <td>Basic Salary</td>
                    <td style="border-right: 1px solid black;">25200</td>
                    <td>EPF</td>
                    <td>1800</td>
                </tr>
                
                <tr>
                    <td>House Rent Allowances</td>
                    <td style="border-right: 1px solid black;">9408</td>
                    <td>Health Insurance</td>
                    <td>500</td>
                </tr>
                
                <tr>
                    <td>Conveyance Allowances</td>
                    <td style="border-right: 1px solid black;">1493</td>
                    <td>Professional Tax</td>
                    <td>200</td>
                </tr>
                
                <tr>
                    <td>Medical Allowances</td>
                    <td style="border-right: 1px solid black;">1167</td>
                    <td>TDS</td>
                    <td>200</td>
                </tr>
                
                <tr>
                    <td>Special Allowances</td>
                    <td style="border-right: 1px solid black;">18732</td>
                    <td></td>
                    <td></td>
                </tr>
                
                <tr>
                    <td>Gross Salary</td>
                    <td style="border-right: 1px solid black;">56000</td>
                    <td>Total Deductions</td>
                    <td>2500</td>
                </tr>
                
                <tr>
                    <th colspan="2">Net Pay</th>
                    <th colspan="2">53500</th>
                </tr>
                
                <tr>
                    <th colspan="4">Amount In Words: Fifty Three Thousand Five Hundred</th>
                </tr>
                
            </table>
            
          </body>
        </html>
       
      `;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', margin: 10, alignSelf: "center" }}>
                    <View style={styles.centerView}>
                        <TouchableOpacity style={styles.touchableOpacity2} onPress={() => { 
                            //askPermission();
                            createPDF(); 
                            }}>
                            <Text style={styles.buttonText2}>View Salary Slip</Text>
                        </TouchableOpacity>
                    </View>

                    {myPdfUri ?
                        <View style={styles.centerView}>
                            <TouchableOpacity style={styles.touchableOpacity2} onPress={() => { downloadSalarySlipPDF() }}>
                                <Text style={styles.buttonText2}>Download</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                </View>
                <View style={{ flex: 1 }}>
                    {loading ? <ActivityIndicator />
                        :
                        (
                            <Pdf
                                source={{ uri: 'file://' + myPdfUri }}
                                trustAllCerts={Platform.OS === 'ios'}
                                style={styles.pdf}
                            />
                        )
                    }
                </View>

            </View>
        </SafeAreaView>
    )
}

export default SalarySlipDetails

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pdf: {
        flex: 1,
        justifyContent: "center",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    centerView: {
        marginVertical: 10,
        marginHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    touchableOpacity2: {
        backgroundColor: Colors.white,
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingTop: 4,
        paddingBottom: 6,
        borderWidth: 1,
        borderColor: Colors.primary
    },
    buttonText2: {
        color: Colors.primary,
        textAlign: "center",
        fontSize: FontSize.medium,
        fontFamily: Fonts.bold,
    },

});

const htmlStyles = `

  /* table */

  h2 {
	text-align:center;
    margin: 50px 0 50px 0;
    }

  table, th {
    border: 1px solid black;
    border-collapse: collapse;
  }
  td, th{
      padding: 5px;
      width: 25%;
  }
  th{
      font-size: 18px
  }

`;
