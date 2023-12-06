import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

import './index.css'
import { Asset, ErrorPage, Root } from './pages'

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/asset',
    element: <Asset />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RouterProvider router={router} />
    </WagmiConfig>
  </React.StrictMode>
)