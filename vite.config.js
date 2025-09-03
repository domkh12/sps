import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
  },
  build: {
    minify: true,
    sourcemap: false,
    target: "modules",
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
          'utils-vendor': ['lodash', 'dayjs', 'aos'],

          // Feature-based chunks
          'auth': [
            './src/pages/auth/Login.jsx',
            './src/pages/auth/ForgotPassword.jsx',
            './src/pages/auth/ResetPassword.jsx',
            './src/pages/auth/RequireAuth.jsx',
            './src/pages/auth/PersistLogin.jsx',
            './src/pages/auth/Prefetch.jsx',
            './src/pages/auth/OAuth2RedirectHandler.jsx'
          ],

          'admin': [
            './src/pages/layoutAdmin/AdminLayout.jsx',
            './src/pages/dashboard/Dashboard.jsx'
          ],

          'manager': [
            './src/pages/layoutManager/ManagerLayout.jsx'
          ],

          'user-management': [
            './src/pages/user/UserList.jsx',
            './src/pages/user/AddNewUser.jsx',
            './src/pages/user/EditUser.jsx',
            './src/pages/user/ViewUser.jsx'
          ],

          'vehicle-management': [
            './src/pages/vehicle/VehicleList.jsx',
            './src/pages/vehicle/AddNewVehicle.jsx',
            './src/pages/vehicle/EditVehicle.jsx',
            './src/pages/vehicle/ViewVehicle.jsx'
          ],

          'parking-management': [
            './src/pages/parkingSpace/ParkingList.jsx',
            './src/pages/parkingSpace/AddNewParking.jsx',
            './src/pages/parkingSpace/ParkingEdit.jsx',
            './src/pages/parkingSpace/ViewParkingSpace.jsx',
            './src/pages/slot/ListParkingSlot.jsx',
            './src/pages/slot/AddNewSlot.jsx',
            './src/pages/slot/EditSlot.jsx',
            './src/pages/slot/ViewSlot.jsx'
          ],

          'reports': [
            './src/pages/report/ReportList.jsx',
            './src/pages/report/CreateReport.jsx',
            './src/pages/report/UserHistory.jsx',
            './src/pages/report/VehicleHistory.jsx'
          ],

          'company-branch': [
            './src/pages/company/ListCompany.jsx',
            './src/pages/company/AddCompany.jsx',
            './src/pages/company/EditCompany.jsx',
            './src/pages/company/ViewCompany.jsx',
            './src/pages/branch/BranchList.jsx',
            './src/pages/branch/AddNewBranch.jsx',
            './src/pages/branch/EditBranch.jsx',
            './src/pages/branch/ViewBranch.jsx'
          ]
        },

        // Better chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
              : 'chunk'
          return `js/${facadeModuleId}-[hash].js`
        }
      }
    },

    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      'react-redux',
      'react-helmet-async',
      'react-toastify',
      'aos',
      'dayjs'
    ],

    // Force optimization of these packages
    force: true
  },

  // Asset handling
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],

  // CSS optimization
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },

  // Enable legacy browser support if needed
  legacy: {
    targets: ['defaults', 'not IE 11']
  },

});
