import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bike, Car, Plus, Ticket, Truck } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const FerryDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const ferry = {
    name: "Ferry Cujupe 1",
    status: "waiting",
    nextBoarding: "14h20",
    from: "Cujupe",
    to: "São Luís",
    boardingTime: "14:20",
    arrival: "15h05",
    capacity: 10,
    total: 40,
  };

  const vehicleTypes = [
    { id: "motorcycle", name: "Moto", price: 25.0, icon: Bike },
    { id: "car", name: "Carro Passeio", price: 45.0, icon: Car },
    { id: "suv", name: "SUV", price: 65.0, icon: Car },
    { id: "truck", name: "Caminhões leves", price: 120.0, icon: Truck },
  ];

  const upcomingTrips = [
    { time: "15h20", capacity: 0, total: 40 },
    { time: "16h20", capacity: 0, total: 40 },
  ];

  const handlePurchase = () => {
    if (!selectedVehicle) {
      Alert.alert('Selecione um veículo', 'Escolha o tipo de veículo antes de comprar');
      return;
    }

    const vehicle = vehicleTypes.find((v) => v.id === selectedVehicle);
    Alert.alert(
      'Bilhete comprado!',
      `${vehicle?.name} - R$ ${vehicle?.price.toFixed(2)}`,
      [{ text: 'OK' }]
    );
  };

  const handleBackPress = () => {
    router.back();
  };

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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{ferry.name}</Text>
            </View>
          </View>
          
          <View style={styles.headerStatus}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.nextBoarding}>
              Próximo Embarque: {ferry.nextBoarding}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Ticket */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bilhete mais recente</Text>
          
          <View style={styles.ticketInfo}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Local de Embarque:</Text> {ferry.from}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Destino:</Text> {ferry.to}
            </Text>
          </View>

          <View style={styles.vehicleSection}>
            <Text style={styles.vehicleTitle}>Pesos:</Text>
            <View style={styles.vehicleGrid}>
              {vehicleTypes.map((vehicle) => {
                const IconComponent = vehicle.icon;
                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    onPress={() => setSelectedVehicle(vehicle.id)}
                    style={[
                      styles.vehicleButton,
                      selectedVehicle === vehicle.id && styles.vehicleButtonSelected
                    ]}
                  >
                    <IconComponent size={24} color="#007AFF" />
                    <Text style={styles.vehiclePrice}>
                      R$ {vehicle.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.vehicleNote}>
              *Moto, Carro Passeio, SUV e Caminhões leves
            </Text>
          </View>

          <View style={styles.ticketDetails}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Horário de embarque:</Text> {ferry.boardingTime}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Previsão de chegada:</Text> {ferry.arrival}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Capacidade:</Text> {ferry.capacity}/{ferry.total}
            </Text>
          </View>

          <View style={styles.purchaseSection}>
            <Text style={styles.price}>
              R$ {vehicleTypes.find((v) => v.id === selectedVehicle)?.price.toFixed(2) || "25,00"}
            </Text>
            <TouchableOpacity 
              style={styles.purchaseButton}
              onPress={handlePurchase}
            >
              <Ticket size={20} color="#FFFFFF" />
              <Text style={styles.purchaseButtonText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Próximos Horários</Text>
          
          <View style={styles.upcomingList}>
            {upcomingTrips.map((trip, index) => (
              <View key={index} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripInfo}>
                    <View style={styles.tripIcon}>
                      <Text style={styles.emoji}>🚢</Text>
                    </View>
                    <View>
                      <Text style={styles.tripName}>{ferry.name}</Text>
                      <Text style={styles.tripCapacity}>
                        Capacidade: {trip.capacity}/{trip.total}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.addTripButton}>
                    <Plus size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.tripTime}>
                  Próxima Viagem: {trip.time}
                </Text>
              </View>
            ))}
          </View>
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
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  nextBoarding: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  ticketInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#000000',
  },
  infoLabel: {
    fontWeight: '600',
  },
  vehicleSection: {
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  vehicleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vehicleButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    minWidth: 70,
  },
  vehicleButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  vehiclePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
    marginTop: 4,
  },
  vehicleNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  ticketDetails: {
    gap: 8,
    marginBottom: 16,
  },
  purchaseSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  purchaseButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  upcomingSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  upcomingList: {
    gap: 12,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  tripCapacity: {
    fontSize: 14,
    color: '#6B7280',
  },
  addTripButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripTime: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default FerryDetail;