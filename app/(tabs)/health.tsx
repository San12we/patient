import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/components/Shared/Colors';
import SubHeading from '@/components/client/SubHeading';
import { fetchPubMedData, fetchFullArticle } from '@/utils/pubmed';

const sections = [
  { id: '1', title: 'Consultations' },
  { id: '2', title: 'Prescription' },
  { id: '3', title: 'Lab Tests' },
  { id: '4', title: 'Reports' },
];

const Health = () => {
  const [selectedSection, setSelectedSection] = useState(sections[0].id);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [fullArticleContent, setFullArticleContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchPubMedData('healthcare insights');
        const articlesArray = Object.values(data).filter(item => item.uid); // Adjust based on actual data structure
        setArticles(articlesArray);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleArticlePress = async (articleId) => {
    try {
      const fullContent = await fetchFullArticle(articleId);
      setFullArticleContent(fullContent);
      setSelectedArticle(articleId);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderSection = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selectedSection === item.id && styles.selectedCard]}
      onPress={() => setSelectedSection(item.id)}
    >
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderArticle = ({ item }) => (
    <TouchableOpacity onPress={() => handleArticlePress(item.uid)}>
      <View style={styles.articleCard}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.articleImage} />
        <View style={styles.articleContent}>
          <Text style={styles.articleTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.articleAuthor} numberOfLines={1}>
            {item.source}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDynamicView = () => {
    switch (selectedSection) {
      case '1':
        return <Text style={styles.dynamicText}>Consultations Content</Text>;
      case '2':
        return <Text style={styles.dynamicText}>Prescription Content</Text>;
      case '3':
        return <Text style={styles.dynamicText}>Lab Tests Content</Text>;
      case '4':
        return <Text style={styles.dynamicText}>Reports Content</Text>;
      default:
        return null;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Existing Horizontal Scroll Section */}
      <View style={styles.container}>
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          initialScrollIndex={0}
        />
      </View>

      {/* Dynamic View */}
      <View style={styles.dynamicContainer}>
        {renderDynamicView()}
      </View>

      {/* Subheading */}
      <View style={styles.section}>
        <SubHeading subHeadingTitle={'Discover Health'} />
        {/* Horizontal FlatList for Articles */}
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.uid}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.articleListContainer}
        />
      </View>

      {/* Modal for Full Article Content */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.fullArticleText}>{fullArticleContent}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Health;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: Colors.primary,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dynamicContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dynamicText: {
    fontSize: 16,
    color: '#333',
  },
  articleListContainer: {
    paddingHorizontal: 10,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.6,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  articleImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 10,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  articleAuthor: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  fullArticleText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
