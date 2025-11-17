import { Bell, ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const Home = () => {
  const userTicket = {
    ferry: "Ferry Cujupe 1",
    status: "waiting",
    route: "Cujupe → São Luís",
    boardingTime: "14:20",
    arrival: "15:05",
    vehicleType: "motorcycle",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userText}>
              <Text style={styles.date}>Jun 25, 2025</Text>
              <Text style={styles.greeting}>Olá, Pedro</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu Bilhete</Text>
          
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ferryName}>{userTicket.ferry}</Text>
                <Text style={styles.ticketDetail}>
                  Travessia: {userTicket.route}
                </Text>
                <Text style={styles.ticketDetail}>
                  Horário de Embarque: {userTicket.boardingTime}
                </Text>
                <Text style={styles.ticketDetail}>
                  Previsão de chegada: {userTicket.arrival}
                </Text>
              </View>
              
              <View style={styles.ticketBadgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Status:</Text>
                </View>
                
                <View style={styles.vehicleIcon}>
                  <Text style={styles.vehicleEmoji}>🏍️</Text>
                </View>
              </View>
            </View>

            <View style={styles.ticketFooter}>
              <Text style={styles.footerNote}>
                *Mostrar Bilhete/QR code no Embarque
              </Text>
              
              <View style={styles.qrCode}>
                <View style={styles.qrGrid}>
                  {[...Array(9)].map((_, i) => (
                    <View key={i} style={styles.qrPixel} />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saiba mais</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Tudo</Text>
              <ChevronRight size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsContainer}
          >
            <View style={[styles.infoCard, styles.primaryCard]}>
              <ChevronRight size={20} color="#FFFFFF" style={styles.cardIcon} />
              <Text style={styles.cardSubtitle}>Quem somos nós?</Text>
              <Text style={styles.cardTitle}>Viva melhor</Text>
            </View>
            
            <View style={[styles.infoCard, styles.warningCard]}>
              <ChevronRight size={20} color="#000000" style={styles.cardIcon} />
              <Text style={[styles.cardSubtitle, styles.warningCardSubtitle]}>🚢</Text>
              <Text style={[styles.cardTitle, styles.warningCardTitle]}>Navegue suas vidas</Text>
            </View>
            
            <View style={[styles.infoCard, styles.darkCard]}>
              <Text style={styles.emoji}>🤖</Text>
              <Text style={styles.moreText}>MAIS</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#000000',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userText: {
    gap: 2,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ferryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  ticketDetail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  ticketBadgeContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  vehicleIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleEmoji: {
    fontSize: 24,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerNote: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  qrCode: {
    width: 64,
    height: 64,
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 4,
  },
  qrGrid: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    gap: 2,
  },
  qrPixel: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#000000',
    borderRadius: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#ff9d00ff',
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    minWidth: 160,
    borderRadius: 12,
    padding: 16,
  },
  primaryCard: {
    backgroundColor: '#ff7b00ff',
  },
  warningCard: {
    backgroundColor: '#FFA500',
  },
  darkCard: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  warningCardSubtitle: {
    color: '#000000',
  },
  warningCardTitle: {
    color: '#000000',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    transform: [{ rotate: '90deg' }],
    marginTop: 32,
  },
});

export default Home;