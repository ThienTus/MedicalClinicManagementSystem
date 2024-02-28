import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import API, { endpoints } from '../../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Statistical = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access-token');
            const response = await API.get(endpoints.appointments, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            // Tạo một đối tượng để đếm số lượng bệnh nhân cho mỗi ngày hẹn
            const appointmentsByDate = {};

            // Đếm số lượng bệnh nhân cho mỗi ngày hẹn và thêm vào đối tượng appointmentsByDate
            response.data.forEach(schedule => {
                const { appointment_date } = schedule;
                appointmentsByDate[appointment_date] = (appointmentsByDate[appointment_date] || 0) + 1;
            });

            // Tạo mảng chứa các đối tượng có thuộc tính label là ngày hẹn và thuộc tính length là số lượng lịch trình có cùng ngày hẹn
            const data = Object.keys(appointmentsByDate).map(appointment_date => ({
                label: appointment_date,
                length: appointmentsByDate[appointment_date],
            }));

            console.log(data);

            setSchedules(data);
        } catch (error) {
            console.error('Error loading schedules:', error);
        }
    };

    const data = schedules.length > 0 ? {
        labels: schedules.map(schedule => schedule.label),
        datasets: [
            {
                data: schedules.map(schedule => schedule.length),
            },
        ],
    } : {
        labels: schedules.map(schedule => schedule.label),
        datasets: [
            {
                data: [schedules.length],
            },
        ],
    };



    return (
        <View style={styles.container}>
            <Text style={styles.subject}>SỐ LƯỢNG BỆNH NHÂN</Text>
            <LineChart
                data={data}
                width={Dimensions.get('window').width - 20}
                height={220}
                yAxisLabel="Bệnh nhân"
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    subject: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 15
    },
});

export default Statistical;
