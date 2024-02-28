import { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import API, { authApi, endpoints } from "../../../configs/API";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApproveSchedule = ({ route, navigation }) => {
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

    const loadSchedules = async () => {
        try {
            let access_token = await AsyncStorage.getItem("access-token");
            console.log(access_token);

            const response = await API.get(endpoints['appointments']);;
            setSchedules(response.data);
        } catch (error) {
            console.error("Error loading schedules:", error);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const approveSchedule = async (schedule) => {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);

        console.log(user);

        try {
            console.log({
                "patient": schedule.patient,
                "appointment_date": schedule.appointment_date,
                "confirmed": true,
                "time_slot": schedule.time_slot,
                "schedule": schedule.schedule
            })
            const response = await API.put(endpoints.appointments + schedule.id + "/", {
                "patient": schedule.patient,
                "appointment_date": schedule.appointment_date,
                "confirmed": true,
                "time_slot": schedule.time_slot,
                "schedule": schedule.schedule
            });
            console.log("Schedule created:", response.data);
            Alert.alert("Xác nhận thành công!");
            setSelectedScheduleId(null);

            loadSchedules();
            setShowCreateSchedule(false);
        } catch (error) {
            console.error("Error creating schedule:", error);
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


    return (
        <View style={styles.container}>
            <Text style={styles.subject}>PHÊ DUYỆT ĐẶT CHỖ</Text>
            <ScrollView>
                {/* Hiển thị danh sách lịch trình */}
                {schedules !== null && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleText}>Mã đặt chỗ: {schedule.id}</Text>
                            <Text style={styles.scheduleText}>Mã lịch trực: {schedule.schedule}</Text>
                            <Text style={styles.scheduleText}>Trạng thái: {schedule.confirmed == true ? "Đã xác nhận" : "Chưa xác nhận"}</Text>
                            <Text style={styles.scheduleText}>Ngày: {schedule.appointment_date}</Text>
                            <Text style={styles.scheduleText}>Thời gian: {schedule.time_slot} giờ</Text>

                            {schedule.confirmed != true && (
                                <>
                                    <TouchableOpacity style={styles.submitButton} onPress={() => approveSchedule(schedule)}>
                                        <Text style={styles.submitButtonText}>Xác Nhận</Text>
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
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    scheduleItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
    },
    scheduleItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    pickerItem: {
        fontSize: 18,
        color: 'blue',
    },
    card: {
        borderWidth: 1,
        width: '100%',
        borderColor: "rgba(155,155,155,1)",
        borderRadius: 5,
        backgroundColor: "rgba(214,210,210,1)",
        marginTop: 5,
        padding: 10, 
    },
    picker: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    subject: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    createScheduleForm: {
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    scheduleItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    scheduleText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});



export default ApproveSchedule;
