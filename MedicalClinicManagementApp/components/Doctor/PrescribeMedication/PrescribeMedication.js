import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Alert, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import API, { authApi, endpoints } from "../../../configs/API";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PrescribeMedication = ({ route, navigation }) => {
    const [schedules, setSchedules] = useState(null);
    const [showCreateSchedule, setShowCreateSchedule] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [newSchedule, setNewSchedule] = useState({
        doctor: "",
        nurse: "",
        date: "",
        shift: "",
    });
    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState("");

    const loadSchedules = async () => {
        try {
            let access_token = await AsyncStorage.getItem("access-token");
            console.log(access_token);

            const response = await API.get(endpoints['appointments']);
            setSchedules(response.data);
        } catch (error) {
            console.error("Error loading schedules:", error);
        }
    };


    const loadMedicines = async () => {
        try {
            const response = await API.get(endpoints.medicines);
            setMedicines(response.data);
        } catch (error) {
            console.error("Error loading medicines:", error);
        }
    };

    useEffect(() => {
        loadSchedules();
        loadMedicines();
    }, []);

    const prescriptions = async (schedule) => {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);

        console.log(user);

        try {
            console.log({
                "doctor": user,
                "patient": schedule.patient,
                "symptoms": symptoms,
                "diagnosis": diagnosis,
                "medicines": selectedMedicine
            })
            let access_token = await AsyncStorage.getItem("access-token");

            const response = await authApi(access_token).post(endpoints['prescriptions-create'], {
                "doctor": user,
                "patient": schedule.patient,
                "symptoms": symptoms,
                "diagnosis": diagnosis,
                "medicines": [selectedMedicine]
            });
            console.log("Prescription created:", response.data);
            Alert.alert("Kê đơn thành công!");
            setSelectedScheduleId(null);

            loadSchedules();
            setShowCreateSchedule(false);
        } catch (error) {
            console.error("Error creating prescription:", error);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            const response = await API.delete(`${endpoints.appointments}${id}/`);
            console.log("Schedule deleted:", response.data);
            Alert.alert("Hủy lịch thành công!");

            loadSchedules();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    const handleMedicineChange = (scheduleId, itemValue) => {
        const updatedSchedules = schedules.map(schedule =>
            schedule.id === scheduleId ? { ...schedule, selectedMedicine: itemValue } : schedule
        );
        setSchedules(updatedSchedules);
        setSelectedMedicine(itemValue);
    };

    // Hàm xử lý thay đổi triệu chứng
    const handleSymptomsChange = (scheduleId, text) => {
        const updatedSchedules = schedules.map(schedule =>
            schedule.id === scheduleId ? { ...schedule, symptoms: text } : schedule
        );
        setSchedules(updatedSchedules);
        setSymptoms(text);
    };

    // Hàm xử lý thay đổi chẩn đoán
    const handleDiagnosisChange = (scheduleId, text) => {
        const updatedSchedules = schedules.map(schedule =>
            schedule.id === scheduleId ? { ...schedule, diagnosis: text } : schedule
        );
        setSchedules(updatedSchedules);
        setDiagnosis(text);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subject}>KÊ ĐƠN</Text>
            <ScrollView>
                {/* Hiển thị danh sách lịch trình */}
                {schedules !== null && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleText}>Mã đặt chỗ: {schedule.id}</Text>
                            <Text style={styles.scheduleText}>Mã lịch trực: {schedule.schedule}</Text>
                            <Text style={styles.scheduleText}>Mã bệnh nhân: {schedule.patient}</Text>
                            <Text style={styles.scheduleText}>Trạng thái: {schedule.confirmed == true ? "Đã xác nhận" : "Chưa xác nhận"}</Text>
                            <Text style={styles.scheduleText}>Ngày: {schedule.appointment_date}</Text>
                            <Text style={styles.scheduleText}>Thời gian: {schedule.time_slot} giờ</Text>

                            {schedule.confirmed === true && (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleSymptomsChange(schedule.id, text)}
                                        value={schedule.symptoms || ""}
                                        placeholder="Triệu chứng"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleDiagnosisChange(schedule.id, text)}
                                        value={schedule.diagnosis || ""}
                                        placeholder="Chẩn đoán"
                                    />
                                    <Picker
                                        selectedValue={schedule.selectedMedicine || ""}
                                        onValueChange={(itemValue, itemIndex) => handleMedicineChange(schedule.id, itemValue)}
                                        style={styles.picker}
                                        itemTextStyle={{ fontSize: 18, color: 'blue' }}
                                    >
                                        {medicines.map((medicine) => (
                                            <Text style={styles.pickerItem} label={medicine.name} value={medicine.id}>Admin</Text>
                                            ))}
                                    </Picker>
                                    <TouchableOpacity style={styles.submitButton} onPress={() => prescriptions(schedule)}>
                                        <Text style={styles.submitButtonText}>Kê Đơn Thuốc</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    ))
                ) : (
                    <Text>Không tìm thấy lịch trình.</Text>
                )}
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    pickerItem: {
        fontSize: 18,
        color: 'blue',
    },
    history: {
        marginBottom: 10
    },
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    timeSlots: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    timeSlot: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    selectedTimeSlot: {
        backgroundColor: '#007bff',
        padding: 10,
        margin: 5,
        borderRadius: 5,
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
});

export default PrescribeMedication;
