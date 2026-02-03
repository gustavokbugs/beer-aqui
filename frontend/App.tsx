import React from 'react';
import { StatusBar } from 'expo-status-bar';
import '@/locales';
import { RootNavigator } from '@/navigation';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
