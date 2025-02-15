import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import Doctors from '../../components/client/Doctors';
import Category from '@/components/client/Category';
import SearchBar from '@/components/client/SearchBar';
import Clinics from '@/components/client/Clinics';
import Posts from '@/components/client/Posts';
import SubHeading from '@/components/client/SubHeading';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import { getDoctors, fetchDoctorsFromStorage } from '../../app/(redux)/doctorSlice';
import { fetchInsuranceProviders } from '../../app/(redux)/insuranceSlice';
import { fetchClinics, fetchClinicsFromStorage } from '../../app/(redux)/clinicSlice';
import { fetchPosts } from '../../app/(redux)/postSlice';
import GlobalApi from '../../Services/GlobalApi';
import useCategories from '@/hooks/useCategories';

const Index: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
    const router = useRouter();
    const dispatch = useDispatch();
    const { doctors, loading: doctorsLoading, error: doctorsError } = useSelector((state) => state.doctors);
    const { clinics, loading: clinicsLoading, error: clinicsError } = useSelector((state) => state.clinics);
    const { insuranceProviders } = useSelector((state) => state.insurance);
    const animation = useRef<LottieView>(null);

    useEffect(() => {
        dispatch(getDoctors());
        dispatch(fetchDoctorsFromStorage());
        dispatch(fetchInsuranceProviders());
        dispatch(fetchClinicsFromStorage());
        dispatch(fetchPosts());
    }, [dispatch]);

    useEffect(() => {
        if (insuranceProviders.length > 0) {
            dispatch(fetchClinics({ insuranceProviders }));
        }
    }, [dispatch, insuranceProviders]);

    const handleSearchSubmit = () => {
        router.push(`/search?query=${searchQuery}`);
    };

    if (doctorsLoading || clinicsLoading || categoriesLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={styles.lottieAnimation}
                    source={require('../../assets/animations/loading3.json')}
                />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <SearchBar setSearchQuery={setSearchQuery} onSubmit={handleSearchSubmit} />
                <Category categories={categories} loading={categoriesLoading} error={categoriesError} />
                <Doctors />
                <Clinics clinics={clinics} loading={clinicsLoading} error={clinicsError} />
                <ClinicSubHeading subHeadingTitle='Explore Insights' />
                <Posts />
            </View>
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#e3f6f5',
        padding: 20,
        paddingBottom: 40,
    },
    innerContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e3f6f5',
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },
});