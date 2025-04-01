import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

interface NotificationData {
  title: string;
  desc: string;
  time: string;
  seen: boolean;
}

interface ContentNotificationProps {
  data: NotificationData;
}

const ContentNotification: React.FC<ContentNotificationProps> = ({data}) => {
  return (
    <TouchableOpacity
      style={[styles.boxNotification, !data.seen && styles.boxActive]}>
      <View style={styles.boxHeader}>
        <Text style={styles.headerNotification}>{data.title}</Text>
        {!data.seen && <View style={styles.circleHeader} />}
      </View>
      <Text style={styles.descriptionNotification}>{data.desc}</Text>
      <Text style={styles.timeNotification}>{data.time}</Text>
    </TouchableOpacity>
  );
};

export default ContentNotification;

const styles = StyleSheet.create({
  boxNotification: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#efffff',

    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  boxActive: {
    backgroundColor: '#c4eeff',
  },
  boxHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleHeader: {
    width: 8,
    height: 8,
    backgroundColor: '#007BFF',
    borderRadius: 9999,
  },
  headerNotification: {
    fontWeight: 'bold',
  },
  descriptionNotification: {
    lineHeight: 22,
  },
  timeNotification: {
    color: '#aaa',
    fontSize: 12,
  },
});
