import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Ship } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Tipos (em produção, importe de shared/types/api.ts)
type Ferry = {
  id: string;
  name: string;
  status: 'boarding' | 'waiting' | 'departed' | 'maintenance';
  capacity: number;
  total: number;
  nextTrip: string;
  route: string;
  from: string;
  to: string;
  price: number;
};

type UserTicket = {
  id: string;
  ferryId: string;
  ferryName: string;
  purchaseDate: string;
  boardingTime: string;
  status: 'active' | 'used' | 'cancelled';
  vehicleType: string;
  price: number;
};

const Viagens = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'myTickets'>('available');
  const [ferries, setFerries] = useState<Ferry[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular dados da API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados - em produção virá da API
      const mockFerries: Ferry[] = [
        {
          id: '1',
          name: 'Ferry São Luís 1',
          status: 'boarding',
          capacity: 37,
          total: 40,
          nextTrip: '10h40',
          route: 'São Luís → Alcântara',
          from: 'São Luís',
          to: 'Alcântara',
          price: 45.00
        },
        {
          id: '2',
          name: 'Ferry Alcântara 1',
          status: 'departed',
          capacity: 40,
          total: 40,
          nextTrip: '13h30',
          route: 'Alcântara → São Luís',
          from: 'Alcântara',
          to: 'São Luís',
          price: 45.00
        },
        {
          id: '3',
          name: 'Ferry Cujupe 1',
          status: 'waiting',
          capacity: 10,
          total: 40,
          nextTrip: '14h30',
          route: 'Cujupe → São Luís',
          from: 'Cujupe',
          to: 'São Luís',
          price: 35.00
        },
      ];

      const mockTickets: UserTicket[] = [
        {
          id: 't1',
          ferryId: '3',
          ferryName: 'Ferry Cujupe 1',
          purchaseDate: '2024-01-20',
          boardingTime: '14h30',
          status: 'active',
          vehicleType: 'car',
          price: 45.00
        },
        {
          id: 't2',
          ferryId: '1',
          ferryName: 'Ferry São Luís 1',
          purchaseDate: '2024-01-19',
          boardingTime: '10h40',
          status: 'used',
          vehicleType: 'motorcycle',
          price: 25.00
        }
      ];

      setFerries(mockFerries);
      setUserTickets(mockTickets);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "boarding": return "#22C55E";
      case "waiting": return "#F59E0B";
      case "departed": return "#EF4444";
      case "maintenance": return "#6B7280";
      default: return "#6B7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "boarding": return "Embarcando";
      case "waiting": return "Aguardando";
      case "departed": return "Saiu";
      case "maintenance": return "Manutenção";
      default: return "Desconhecido";
    }
  };

  const handleFerryPress = (ferry: Ferry) => {
    router.push(`./ferry-details/${ferry.id}`);
  };

  const handleBuyTicket = (ferry: Ferry) => {
  router.push({
    pathname: '/payment/[ferryId]',
    params: { ferryId: ferry.id }
  } as any);
};

  const handleBackPress = () => {
    router.back();
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Minhas Viagens</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'available' && styles.activeTab]}
              onPress={() => setActiveTab('available')}
            >
              <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                Embarcações
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'myTickets' && styles.activeTab]}
              onPress={() => setActiveTab('myTickets')}
            >
              <Text style={[styles.tabText, activeTab === 'myTickets' && styles.activeTabText]}>
                Meus Bilhetes ({userTickets.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.legendText}>Embarcando</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Aguardando</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Saiu</Text>
          </View>
        </View>

        {activeTab === 'available' ? (
          /* Lista de Embarcações Disponíveis */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Embarcações Disponíveis</Text>
            
            <View style={styles.ferriesList}>
              {ferries.map((ferry) => (
                <TouchableOpacity 
                  key={ferry.id}
                  style={styles.ferryCard}
                  onPress={() => handleFerryPress(ferry)}
                >
                  <View style={styles.ferryHeader}>
                    <View style={styles.ferryInfo}>
                      <Ship size={20} color="#007AFF" style={styles.shipIcon} />
                      <View style={styles.ferryDetails}>
                        <Text style={styles.ferryName}>{ferry.name}</Text>
                        <View style={styles.routeContainer}>
                          <MapPin size={14} color="#6B7280" />
                          <Text style={styles.routeText}>{ferry.route}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                          <View style={[styles.statusDot, { backgroundColor: getStatusColor(ferry.status) }]} />
                          <Text style={styles.statusText}>{getStatusLabel(ferry.status)}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.buyButton}
                      onPress={() => handleBuyTicket(ferry)}
                    >
                      <Text style={styles.buyButtonText}>{formatCurrency(ferry.price)}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ferryFooter}>
                    <View style={styles.footerInfo}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.footerText}>Próxima: {ferry.nextTrip}</Text>
                    </View>
                    <Text style={styles.capacityText}>
                      {ferry.capacity}/{ferry.total} vagas
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Lista de Bilhetes do Usuário */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus Bilhetes</Text>
            
            {userTickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhum bilhete comprado</Text>
                <Text style={styles.emptyStateSubtext}>
                  Compre seu primeiro bilhete nas embarcações disponíveis
                </Text>
              </View>
            ) : (
              <View style={styles.ticketsList}>
                {userTickets.map((ticket) => (
                  <View key={ticket.id} style={styles.ticketCard}>
                    <View style={styles.ticketHeader}>
                      <View style={styles.ticketInfo}>
                        <Text style={styles.ticketName}>{ticket.ferryName}</Text>
                        <Text style={styles.ticketDate}>
                          Comprado em {new Date(ticket.purchaseDate).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: ticket.status === 'active' ? '#22C55E' : '#6B7280' }
                      ]}>
                        <Text style={styles.statusBadgeText}>
                          {ticket.status === 'active' ? 'Ativo' : 'Utilizado'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.ticketDetails}>
                      <Text style={styles.ticketDetail}>
                        <Text style={styles.detailLabel}>Embarque:</Text> {ticket.boardingTime}
                      </Text>
                      <Text style={styles.ticketDetail}>
                        <Text style={styles.detailLabel}>Veículo:</Text> {ticket.vehicleType}
                      </Text>
                      <Text style={styles.ticketDetail}>
                        <Text style={styles.detailLabel}>Valor:</Text> {formatCurrency(ticket.price)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  ferriesList: {
    gap: 12,
  },
  ferryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ferryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ferryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  shipIcon: {
    marginTop: 2,
  },
  ferryDetails: {
    flex: 1,
    gap: 6,
  },
  ferryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  buyButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ferryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  capacityText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ticketDetails: {
    gap: 4,
  },
  ticketDetail: {
    fontSize: 14,
    color: '#000000',
  },
  detailLabel: {
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});

export default Viagens;