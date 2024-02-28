import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { authApi, endpoints } from "../../../configs/API";
import { PDFDocument, rgb } from 'react-native-pdf-lib'; // Import thư viện PDF mới

const Payment = ({ route, navigation }) => {
    const [schedules, setSchedules] = useState(null);
    const [consultationFee, setConsultationFee] = useState('');
    const [prescriptionCost, setPrescriptionCost] = useState('');

    const loadSchedules = async () => {
        try {
            let access_token = await AsyncStorage.getItem("access-token");
            const response = await authApi(access_token).get(endpoints['prescriptions']);
            setSchedules(response.data);
        } catch (error) {
            console.error("Error loading schedules:", error);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const generatePDF = async (schedule, consultationFee, prescriptionCost) => {
        // Tạo nội dung PDF từ dữ liệu lịch trình, tiền khám và chi phí ra toa
        let content = "DANH SÁCH TOA THUỐC\n\n";
        content += "Tiền khám: " + consultationFee + "\n";
        content += "Chi phí ra toa: " + prescriptionCost + "\n\n";

        content += "Mã đơn thuốc: " + schedule.id + "\n";
        content += "Mã bác sỹ: " + schedule.doctor + "\n";
        content += "Mã bệnh nhân: " + schedule.patient + "\n";
        content += "Triệu chứng: " + schedule.symptoms + "\n";
        content += "Chẩn đoán: " + schedule.diagnosis + "\n\n";

        Alert.alert('Đơn Thanh Toán', content); // Alert nội dung PDF
    };

    const preparePDFContent = () => {
        // Tạo nội dung PDF từ dữ liệu lịch trình, tiền khám và chi phí ra toa
        let content = "DANH SÁCH TOA THUỐC\n\n";
        content += "Tiền khám: " + consultationFee + "\n";
        content += "Chi phí ra toa: " + prescriptionCost + "\n\n";

        if (schedules && schedules.length > 0) {
            schedules.forEach((schedule) => {
                content += "Mã đơn thuốc: " + schedule.id + "\n";
                content += "Mã bác sỹ: " + schedule.doctor + "\n";
                content += "Mã bệnh nhân: " + schedule.patient + "\n";
                content += "Triệu chứng: " + schedule.symptoms + "\n";
                content += "Chẩn đoán: " + schedule.diagnosis + "\n\n";
            });
        } else {
            content += "Không tìm thấy dữ liệu lịch trình.\n";
        }

        Alert.alert('Nội dung PDF', content); // Alert nội dung PDF
        return content;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subject}>THANH TOÁN</Text>
            <ScrollView>
                {/* Hiển thị danh sách lịch trình */}
                {schedules !== null && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleText}>Mã đơn thuốc: {schedule.id}</Text>
                            <Text style={styles.scheduleText}>Mã bác sỹ: {schedule.doctor}</Text>
                            <Text style={styles.scheduleText}>Mã bệnh nhân: {schedule.patient}</Text>
                            <Text style={styles.scheduleText}>Triệu chứng: {schedule.symptoms}</Text>
                            <Text style={styles.scheduleText}>Chẩn đoán: {schedule.diagnosis}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tiền khám"
                                keyboardType="numeric"
                                value={consultationFee[schedule.id] || ''}
                                onChangeText={text => setConsultationFee(prevState => ({
                                    ...prevState,
                                    [schedule.id]: text
                                }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Chi phí ra toa"
                                keyboardType="numeric"
                                value={prescriptionCost[schedule.id] || ''}
                                onChangeText={text => setPrescriptionCost(prevState => ({
                                    ...prevState,
                                    [schedule.id]: text
                                }))}
                            />

                            {/* Nút thanh toán */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => generatePDF(schedule, consultationFee[schedule.id], prescriptionCost[schedule.id])}
                            >
                                <Text style={styles.submitButtonText}>Thanh Toán</Text>
                            </TouchableOpacity>
                        </View>

                    ))
                ) : (
                    <Text>Không tìm thấy dữ liệu.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    subject: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scheduleItem: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        marginVertical: 5,
        borderRadius: 5,
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Payment;
