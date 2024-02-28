import { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import API, { endpoints } from "../../../configs/API";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Schedule = ({ route, navigation }) => {
    const [schedules, setSchedules] = useState(null);
    const [showCreateSchedule, setShowCreateSchedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        doctor: "",
        nurse: "",
        date: "",
        shift: "",
    });

    const loadSchedules = async () => {
        let userId = await AsyncStorage.getItem("user");
        userId = JSON.parse(userId);
    
        try {
            const response = await API.get(endpoints.schedules);
            const filteredSchedules = response.data.filter(schedule => schedule.doctor === userId);
            setSchedules(filteredSchedules);
        } catch (error) {
            console.error("Error loading schedules:", error);
        }
    };
    

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleChange = (field, value) => {
        setNewSchedule({ ...newSchedule, [field]: value });
    };

    const createSchedule = async () => {
        try {
            const response = await API.post(endpoints.schedules, newSchedule);
            console.log("Schedule created:", response.data);
            loadSchedules();
            setShowCreateSchedule(false);
        } catch (error) {
            console.error("Error creating schedule:", error);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            const response = await API.delete(`${endpoints.schedules}${id}/`);
            console.log("Schedule deleted:", response.data);
            loadSchedules();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Lịch Làm việc"
                onPress={() => setShowCreateSchedule(true)}
            />
            <ScrollView>
                {schedules !== null && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleText}>Mã bác sĩ: {schedule.doctor}</Text>
                            <Text style={styles.scheduleText}>Mã y tá: {schedule.nurse}</Text>
                            <Text style={styles.scheduleText}>Ngày: {schedule.date}</Text>
                            <Text style={styles.scheduleText}>Buổi: {schedule.shift}</Text>
                        </View>
                    ))
                ) : (
                    <Text>Không tìm thấy lịch trình.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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



export default Schedule;
