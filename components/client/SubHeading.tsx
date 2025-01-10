import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Colors from '../Shared/Colors';

interface SubHeadingProps {
  subHeadingTitle: string;
  onViewAll?: () => void;
}

const SubHeading: React.FC<SubHeadingProps> = ({ subHeadingTitle}) => {
  return (
    <View style={styles.container as StyleProp<ViewStyle>}>
      <Text style={styles.title}>{subHeadingTitle}</Text>
      
        <TouchableOpacity>
          <Text style={styles.viewAll}>view all</Text>
        </TouchableOpacity>
     
    </View>
  );
};

const styles = {
    container: {
      display: 'flex' as 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center' as 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Poppins_700Bold',
    },
    viewAll: {
      fontFamily: 'Poppins_500Medium',
      color: Colors.PRIMARY,
    },
  };

export default SubHeading;
