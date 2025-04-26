// test-i18n-config.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Auth
            'auth.login.title': 'Login',
            'auth.login.username': 'Username:',
            'auth.login.password': 'Password:',
            'auth.login.loginButton': 'Login',
            'auth.login.noAccount': "Don't have an account?",
            'auth.login.register': 'Register',

            'auth.register.title': 'Welcome to Fleet Master',
            'auth.register.subtitle': 'Start managing your fleet with ease. Sign up now to keep track of your fleet and stay organized.',
            'auth.register.registerButton': 'Register',
            'auth.register.hasAccount': 'Already have an account?',
            'auth.register.login': 'Login',

            'auth.register.form.firstName': 'First Name',
            'auth.register.form.lastName': 'Last Name',
            'auth.register.form.username': 'Username',
            'auth.register.form.email': 'Email Address',
            'auth.register.form.phone': 'Phone Number',
            'auth.register.form.password': 'Password',
            'auth.register.form.confirmPassword': 'Confirm Password',
            'auth.register.form.addressInformationTitle': 'Address Information (Optional)',
            'auth.register.form.collapseAddress': 'ADD ADDRESS',
            'auth.register.form.toggleAddress': 'HIDE',
            'auth.register.form.street': 'Street Address',
            'auth.register.form.city': 'City',
            'auth.register.form.state': 'State/Province',
            'auth.register.form.country': 'Country',
            'auth.register.form.zip': 'ZIP/Postal Code',

            'auth.register.agreement.title': "By continuing you agree to Fleet Master's",
            'auth.register.agreement.terms': 'Terms of Service',
            'auth.register.agreement.policy': 'Privacy Policy',
            'auth.register.agreement.and': 'and',

            // Common
            'common.edit': 'Edit',
            'common.delete': 'Delete',
            'common.cancel': 'Cancel',
            'common.submit': 'Submit',
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.save': 'Save',
            'common.close': 'Close',
            'common.notAvailable': 'N/A',
            'common.mileage': 'Mileage:',
            'common.totalCost': 'Total Cost:',

            // Layout
            'layout.dashboard.dashboard': 'Dashboard',
            'layout.dashboard.vehicles': 'Vehicles',
            'layout.dashboard.drivers': 'Drivers',
            'layout.dashboard.maintenance': 'Maintenance',
            'layout.dashboard.reports': 'Reports Overview',
            'layout.dashboard.logout': 'Logout',

            'layout.maintenance.title': 'Maintenance',
            'layout.maintenance.overview': 'Maintenance Overview',
            'layout.maintenance.parts': 'Parts',
            'layout.maintenance.partProviders': 'Part Providers',
            'layout.maintenance.serviceProviders': 'ServiceProviders',
            'layout.maintenance.reports': 'Reports',
            'layout.maintenance.exit': 'Exit',

            // Vehicles
            'pages.vehicle.title': "Vehicles Management",
            'pages.vehicle.subtitle': 'View and manage your fleet',
            'pages.vehicle.addButton': 'Add vehicle',

            'pages.vehicle.dialog.registration': 'Registration number',
            'pages.vehicle.dialog.make': 'Make',
            'pages.vehicle.dialog.model': 'Model',
            'pages.vehicle.dialog.year': 'Year',
            'pages.vehicle.dialog.vin': 'Vin',
            'pages.vehicle.dialog.color': 'Color',
            'pages.vehicle.dialog.mileage': 'Mileage',
            'pages.vehicle.dialog.capacity': 'Capacity',
            'pages.vehicle.dialog.insurancePolicyNum': 'Insurance policy number',
            'pages.vehicle.dialog.notes': 'Notes',
            'pages.vehicle.dialog.purchaseDate': 'Purchase Date',
            'pages.vehicle.dialog.lastServiceDate': 'Last Service Date',
            'pages.vehicle.dialog.nextServiceDue': 'Next Service Due',
            'pages.vehicle.dialog.insuranceExpiryDate': 'Insurance Expiry Date',
            'pages.vehicle.dialog.licenseExpiryDate': 'License Expiry Date',

            'pages.vehicle.dialog.type.title': 'Vehicle Type',
            'pages.vehicle.dialog.type.types.CAR': 'Car',
            'pages.vehicle.dialog.type.types.MOTORCYCLE': 'Motorcycle',
            'pages.vehicle.dialog.type.types.TRUCK': 'Truck',
            'pages.vehicle.dialog.type.types.VAN': 'Van',

            'pages.vehicle.dialog.status.title': 'Vehicle Status',
            'pages.vehicle.dialog.status.statuses.ACTIVE': 'Active',
            'pages.vehicle.dialog.status.statuses.IN_MAINTENANCE': 'In maintenance',
            'pages.vehicle.dialog.status.statuses.OUT_OF_SERVICE': 'Out of service',

            'pages.vehicle.dialog.fuel.title': 'Fuel type',
            'pages.vehicle.dialog.fuel.types.GASOLINE': 'Gasoline',
            'pages.vehicle.dialog.fuel.types.DIESEL': 'Diesel',
            'pages.vehicle.dialog.fuel.types.ELECTRIC': 'Electric',
            'pages.vehicle.dialog.fuel.types.HYBRID': 'Hybrid',

            'pages.vehicle.card.name': 'Vehicle name',
            'pages.vehicle.card.purchaseDate': 'Purchase date',
            'pages.vehicle.card.capacity': 'Capacity',
            'pages.vehicle.card.mileage': 'Mileage',
            'pages.vehicle.card.nextServiceDue': 'Next service due',
            'pages.vehicle.card.status': 'status',
            'pages.vehicle.card.maintenance': 'Maintenance',
            'pages.vehicle.card.generalInfo': 'General Information',
            'pages.vehicle.card.maintenanceInfo': 'Maintenance Information',

            // Maintenance Overview
            'pages.vehicle.maintenance.overview.title': 'Maintenance Overview',

            'pages.vehicle.maintenance.overview.summaryMetrics.tabs.yearly': 'Yearly Overview',
            'pages.vehicle.maintenance.overview.summaryMetrics.tabs.monthly': 'Monthly Breakdown',

            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.totalCost.title': 'Total Maintenance Cost',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.totalCost.events': 'maintenance events',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.title': 'Maintenance by Type',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.preventive': 'Preventive',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.byType.curative': 'Curative',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.title': 'Year-over-Year Comparison',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.higher': 'Higher than previous year',
            'pages.vehicle.maintenance.overview.summaryMetrics.yearly.yearComparison.lower': 'Lower than previous year',

            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.title': 'Monthly Maintenance Cost',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.events': 'maintenance events',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.title': 'Monthly Breakdown',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.preventive': 'Preventive',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.breakdown.curative': 'Curative',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.title': 'Month-over-Month Change',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.higher': 'Higher than',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.monthChange.lower': 'Lower than',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.title': 'Year-over-Year Monthly Change',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.higher': 'Higher than same month last year',
            'pages.vehicle.maintenance.overview.summaryMetrics.monthly.yearChange.lower': 'Lower than same month last year',

            'pages.vehicle.maintenance.overview.summaryMetrics.months.january': 'January',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.february': 'February',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.march': 'March',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.april': 'April',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.may': 'May',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.june': 'June',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.july': 'July',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.august': 'August',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.september': 'September',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.october': 'October',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.november': 'November',
            'pages.vehicle.maintenance.overview.summaryMetrics.months.december': 'December',

            'pages.vehicle.maintenance.overview.vehiclePanel.title': 'Vehicle Details',
            'pages.vehicle.maintenance.overview.vehiclePanel.registration': 'Registration',
            'pages.vehicle.maintenance.overview.vehiclePanel.vehicle': 'Vehicle',
            'pages.vehicle.maintenance.overview.vehiclePanel.vin': 'VIN',
            'pages.vehicle.maintenance.overview.vehiclePanel.type': 'Type',
            'pages.vehicle.maintenance.overview.vehiclePanel.mileage': 'Mileage',
            'pages.vehicle.maintenance.overview.vehiclePanel.status': 'Status',
            'pages.vehicle.maintenance.overview.vehiclePanel.lastService': 'Last Service',
            'pages.vehicle.maintenance.overview.vehiclePanel.nextServiceDue': 'Next Service Due',
            'pages.vehicle.maintenance.overview.vehiclePanel.notAvailable': 'N/A',
            'pages.vehicle.maintenance.overview.vehiclePanel.km': 'km',

            'pages.vehicle.maintenance.overview.yearlyComparisonChart.title': 'Annual Cost Comparison',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.legend.currentYear': 'Current Year',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.legend.prevYear': 'Previous Year',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.dollar': '$',

            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.jan': 'Jan',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.feb': 'Feb',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.mar': 'Mar',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.apr': 'Apr',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.may': 'May',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.jun': 'Jun',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.jul': 'Jul',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.aug': 'Aug',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.sep': 'Sep',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.oct': 'Oct',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.nov': 'Nov',
            'pages.vehicle.maintenance.overview.yearlyComparisonChart.axis.months.dec': 'Dec',

            'pages.vehicle.maintenance.overview.yearlyComparisonChart.tooltip.cost': 'Cost',

            'pages.vehicle.maintenance.overview.timeline.title': 'Maintenance Timeline',
            'pages.vehicle.maintenance.overview.timeline.noEvents': 'No maintenance events found for the selected timeframe.',
            'pages.vehicle.maintenance.overview.timeline.legend.preventive': 'Preventive',
            'pages.vehicle.maintenance.overview.timeline.legend.curative': 'Curative',
            'pages.vehicle.maintenance.overview.timeline.tooltip.date': 'Date',
            'pages.vehicle.maintenance.overview.timeline.tooltip.type': 'Type',
            'pages.vehicle.maintenance.overview.timeline.tooltip.cost': 'Cost',
            'pages.vehicle.maintenance.overview.timeline.tooltip.description': 'Description',
            'pages.vehicle.maintenance.overview.timeline.preventiveLabel': 'P',
            'pages.vehicle.maintenance.overview.timeline.curativeLabel': 'C',

            // Maintenance Reports
            'pages.vehicle.maintenance.overview.reports.title': 'Maintenance Reports',
            'pages.vehicle.maintenance.overview.reports.list.goBack': 'Go Back',
            'pages.vehicle.maintenance.overview.reports.list.search': 'Search reports...',

            'pages.vehicle.maintenance.overview.reports.list.type.title': 'Type',
            'pages.vehicle.maintenance.overview.reports.list.type.types.ALL': 'All Types',
            'pages.vehicle.maintenance.overview.reports.list.type.types.PREVENTIVE': 'PREVENTIVE',
            'pages.vehicle.maintenance.overview.reports.list.type.types.CURATIVE': 'CURATIVE',

            'pages.vehicle.maintenance.overview.reports.list.sort.title': 'Sort By',
            'pages.vehicle.maintenance.overview.reports.list.sort.types.date_desc': 'Newest First',
            'pages.vehicle.maintenance.overview.reports.list.sort.types.date_asc': 'Oldest First',
            'pages.vehicle.maintenance.overview.reports.list.sort.types.cost_desc': 'Highest Cost',
            'pages.vehicle.maintenance.overview.reports.list.sort.types.cost_asc': 'Lowest Cost',

            'pages.vehicle.maintenance.overview.reports.list.resultSummary.plural': 'Reports Found',
            'pages.vehicle.maintenance.overview.reports.list.resultSummary.single': 'Report Found',

            'pages.vehicle.maintenance.overview.reports.list.card.unknown': 'Unknown',
            'pages.vehicle.maintenance.overview.reports.list.card.vehicle': 'Vehicle',
            'pages.vehicle.maintenance.overview.reports.list.card.label.period': 'Period',
            'pages.vehicle.maintenance.overview.reports.list.card.label.mileage': 'Mileage',
            'pages.vehicle.maintenance.overview.reports.list.card.label.totalCost': 'Total Cost',
            'pages.vehicle.maintenance.overview.reports.list.card.label.providers': 'Providers',
            'pages.vehicle.maintenance.overview.reports.list.card.value.to': 'to',
            'pages.vehicle.maintenance.overview.reports.list.card.value.notRecorded': 'Not recorded',

            'pages.vehicle.maintenance.overview.reports.list.card.actions.edit': 'Edit Report',
            'pages.vehicle.maintenance.overview.reports.list.card.actions.delete': 'Delete Report',
            'pages.vehicle.maintenance.overview.reports.list.card.actions.less': 'Show Less',
            'pages.vehicle.maintenance.overview.reports.list.card.actions.more': 'Show More',

            'pages.vehicle.maintenance.overview.reports.list.card.parts.title': 'Parts Used',
            'pages.vehicle.maintenance.overview.reports.list.card.parts.unnamed': 'Unnamed Part',
            'pages.vehicle.maintenance.overview.reports.list.card.parts.quantity': 'Qty: 1',
            'pages.vehicle.maintenance.overview.reports.list.card.parts.cost': 'Parts Total',
            'pages.vehicle.maintenance.overview.reports.list.card.parts.none': 'No parts used in this maintenance',

            'pages.vehicle.maintenance.overview.reports.list.card.services.title': 'Service Providers',
            'pages.vehicle.maintenance.overview.reports.list.card.services.unknown': 'Unknown Provider',
            'pages.vehicle.maintenance.overview.reports.list.card.services.cost': 'Services Total',
            'pages.vehicle.maintenance.overview.reports.list.card.services.none': 'No external service providers used for this maintenance',

            'pages.vehicle.maintenance.overview.reports.list.none': 'No maintenance reports found',
            'pages.vehicle.maintenance.overview.reports.list.try': 'Try adjusting your search or filters',

            'pages.vehicle.maintenance.overview.reports.deleteDialog.title': 'Confirm Deletion',
            'pages.vehicle.maintenance.overview.reports.deleteDialog.subtitle': 'Are you sure you want to delete this maintenance report? This action cannot be undone.',

            'pages.vehicle.maintenance.overview.reports.dialog.title': 'New Maintenance Report',
            'pages.vehicle.maintenance.overview.reports.dialog.type.title': 'Maintenance Type',
            'pages.vehicle.maintenance.overview.reports.dialog.type.types.PREVENTIVE': 'Preventive',
            'pages.vehicle.maintenance.overview.reports.dialog.type.types.CURATIVE': 'Curative',
            'pages.vehicle.maintenance.overview.reports.dialog.mileage': 'Mileage',
            'pages.vehicle.maintenance.overview.reports.dialog.startDate': 'Start Date',
            'pages.vehicle.maintenance.overview.reports.dialog.endDate': 'End Date',
            'pages.vehicle.maintenance.overview.reports.dialog.description': 'Description',

            'pages.vehicle.maintenance.overview.reports.dialog.part.title': 'Part Purchases',
            'pages.vehicle.maintenance.overview.reports.dialog.part.name': 'Part name',
            'pages.vehicle.maintenance.overview.reports.dialog.part.notFound': 'Part not found',
            'pages.vehicle.maintenance.overview.reports.dialog.part.provider.title': 'Parts provider',
            'pages.vehicle.maintenance.overview.reports.dialog.part.purchaseDate': 'Purchase Date',
            'pages.vehicle.maintenance.overview.reports.dialog.part.cost': 'Cost',
            'pages.vehicle.maintenance.overview.reports.dialog.part.actions.add': 'Add Part',
            'pages.vehicle.maintenance.overview.reports.dialog.part.actions.addPurchase': 'Add Part Purchase',

            'pages.vehicle.maintenance.overview.reports.dialog.service.title': 'Services',
            'pages.vehicle.maintenance.overview.reports.dialog.service.provider.title': 'Service provider',
            'pages.vehicle.maintenance.overview.reports.dialog.service.serviceDate': 'Service Date',
            'pages.vehicle.maintenance.overview.reports.dialog.service.cost': 'Cost',
            'pages.vehicle.maintenance.overview.reports.dialog.service.description': 'Description',
            'pages.vehicle.maintenance.overview.reports.dialog.service.actions.add': 'Add Service',
            'pages.vehicle.maintenance.overview.reports.dialog.service.actions.addEvent': 'Add Service Event',

            'pages.vehicle.maintenance.overview.reports.dialog.actions.save': 'Save Report',

            // Parts
            'pages.vehicle.maintenance.parts.title': 'Parts Management',
            'pages.vehicle.maintenance.parts.subtitle': 'Here is the list of parts.',
            'pages.vehicle.maintenance.parts.search': 'Search parts...',
            'pages.vehicle.maintenance.parts.addButton': 'Add Part',
            'pages.vehicle.maintenance.parts.resultsCount.found': 'results found',
            'pages.vehicle.maintenance.parts.resultsCount.total': 'total parts',
            'pages.vehicle.maintenance.parts.noResults.withSearch': 'No parts match your search',
            'pages.vehicle.maintenance.parts.noResults.empty': 'No parts available. Add your first part!',
            'pages.vehicle.maintenance.parts.pagination.itemsPerPage': 'Items per page:',
            'pages.vehicle.maintenance.parts.pagination.of': 'of',

            'pages.vehicle.maintenance.parts.dialog.add': 'Add New Part',
            'pages.vehicle.maintenance.parts.dialog.edit': 'Edit Part',
            'pages.vehicle.maintenance.parts.dialog.name': 'Part Name',
            'pages.vehicle.maintenance.parts.dialog.description': 'Description',
            'pages.vehicle.maintenance.parts.dialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.parts.dialog.actions.add': 'Add Part',
            'pages.vehicle.maintenance.parts.dialog.actions.save': 'Save Changes',

            'pages.vehicle.maintenance.parts.deleteDialog.title': 'Confirm Deletion',
            'pages.vehicle.maintenance.parts.deleteDialog.subtitle': 'Are you sure you want to delete the part ? This action cannot be undone.',
            'pages.vehicle.maintenance.parts.deleteDialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.parts.deleteDialog.actions.delete': 'Delete',

            'pages.vehicle.maintenance.parts.errors.createError': 'Error while creating part',
            'pages.vehicle.maintenance.parts.errors.updateError': 'Error while updating part',
            'pages.vehicle.maintenance.parts.errors.deleteError': 'Error while deleting part',

            // Part Providers
            'pages.vehicle.maintenance.partProviders.title': "Part Provider's List",
            'pages.vehicle.maintenance.partProviders.subtitle': 'Here is the list of part providers.',
            'pages.vehicle.maintenance.partProviders.addButton': 'Add part provider',

            'pages.vehicle.maintenance.partProviders.dialog.add': 'Add New Part Provider',
            'pages.vehicle.maintenance.partProviders.dialog.edit': 'Edit Part Provider',
            'pages.vehicle.maintenance.partProviders.dialog.name': 'Provider Name',
            'pages.vehicle.maintenance.partProviders.dialog.address': 'Address',
            'pages.vehicle.maintenance.partProviders.dialog.phoneNumber': 'Phone Number',
            'pages.vehicle.maintenance.partProviders.dialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.partProviders.dialog.actions.add': 'Add Provider',
            'pages.vehicle.maintenance.partProviders.dialog.actions.save': 'Save Changes',

            'pages.vehicle.maintenance.partProviders.deleteDialog.title': 'Confirm Deletion',
            'pages.vehicle.maintenance.partProviders.deleteDialog.subtitle': 'Are you sure you want to delete this part provider? This action cannot be undone.',
            'pages.vehicle.maintenance.partProviders.deleteDialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.partProviders.deleteDialog.actions.delete': 'Delete',

            'pages.vehicle.maintenance.partProviders.errors.createError': 'Error while creating part provider',
            'pages.vehicle.maintenance.partProviders.errors.updateError': 'Error while updating part provider',
            'pages.vehicle.maintenance.partProviders.errors.deleteError': 'Error while deleting part provider',

            // Service Providers
            'pages.vehicle.maintenance.serviceProviders.title': "Service Provider's List",
            'pages.vehicle.maintenance.serviceProviders.subtitle': 'Here is the list of service providers.',
            'pages.vehicle.maintenance.serviceProviders.addButton': 'Add service provider',

            'pages.vehicle.maintenance.serviceProviders.dialog.add': 'Add New Service Provider',
            'pages.vehicle.maintenance.serviceProviders.dialog.edit': 'Edit Service Provider',
            'pages.vehicle.maintenance.serviceProviders.dialog.name': 'Provider Name',
            'pages.vehicle.maintenance.serviceProviders.dialog.address': 'Address',
            'pages.vehicle.maintenance.serviceProviders.dialog.phoneNumber': 'Phone Number',
            'pages.vehicle.maintenance.serviceProviders.dialog.serviceType': 'Service Type',
            'pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.MECHANIC': 'Mechanic',
            'pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.ELECTRICIAN': 'Electrician',
            'pages.vehicle.maintenance.serviceProviders.dialog.serviceTypes.CLEANING': 'Cleaning',
            'pages.vehicle.maintenance.serviceProviders.dialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.serviceProviders.dialog.actions.add': 'Add Provider',
            'pages.vehicle.maintenance.serviceProviders.dialog.actions.save': 'Save Changes',

            'pages.vehicle.maintenance.serviceProviders.deleteDialog.title': 'Confirm Deletion',
            'pages.vehicle.maintenance.serviceProviders.deleteDialog.subtitle': 'Are you sure you want to delete this service provider? This action cannot be undone.',
            'pages.vehicle.maintenance.serviceProviders.deleteDialog.actions.cancel': 'Cancel',
            'pages.vehicle.maintenance.serviceProviders.deleteDialog.actions.delete': 'Delete',

            'pages.vehicle.maintenance.serviceProviders.errors.createError': 'Error while creating service provider',
            'pages.vehicle.maintenance.serviceProviders.errors.updateError': 'Error while updating service provider',
            'pages.vehicle.maintenance.serviceProviders.errors.deleteError': 'Error while deleting service provider',

            // Reports
            'pages.vehicle.maintenance.reports.title': 'Maintenance Overview',
            'pages.vehicle.maintenance.reports.addButton': 'New Report',
            'pages.vehicle.maintenance.reports.badgeText': 'Dates with badges indicate scheduled maintenance activities',
            'pages.vehicle.maintenance.reports.count': 'Total maintenance record',
            'pages.vehicle.maintenance.reports.snack.add': 'Report added successfully!',
            'pages.vehicle.maintenance.reports.snack.edit': 'Report edited successfully!',
            'pages.vehicle.maintenance.reports.snack.delete': 'Report deleted successfully!'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false // This is important for tests
        }
    });

export default i18n;