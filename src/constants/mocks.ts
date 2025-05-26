import { YearlyData } from "@/types/maintenance";

export const mockMaintenanceData: [number, YearlyData][] = [
  [
    2023,
    {
      total_cost: 12500.75,
      yoy_change: 8.5,
      top_recurring_issues: [
        {
          part_name: "Oil Filter",
          part_count: 6,
          part_cost: 420.50,
          part_rank: 1
        },
        {
          part_name: "Brake Pads",
          part_count: 4,
          part_cost: 680.00,
          part_rank: 2
        },
        {
          part_name: "Air Filter",
          part_count: 3,
          part_cost: 150.25,
          part_rank: 3
        }
      ],
      1: { // January
        total_cost: 950.25,
        mom_change: null,
        top_recurring_issues: [
          {
            part_name: "Oil Filter",
            part_count: 1,
            part_cost: 70.00,
            part_rank: 1
          }
        ]
      },
      2: { // February
        total_cost: 1200.50,
        mom_change: 26.3,
        top_recurring_issues: [
          {
            part_name: "Brake Pads",
            part_count: 1,
            part_cost: 170.00,
            part_rank: 1
          },
          {
            part_name: "Oil Filter",
            part_count: 1,
            part_cost: 70.00,
            part_rank: 2
          }
        ]
      },
      3: { // March
        total_cost: 850.00,
        mom_change: -29.2,
        top_recurring_issues: []
      },
      6: { // June
        total_cost: 2100.75,
        mom_change: 12.5,
        top_recurring_issues: [
          {
            part_name: "Tires",
            part_count: 4,
            part_cost: 1200.00,
            part_rank: 1
          },
          {
            part_name: "Oil Filter",
            part_count: 1,
            part_cost: 70.50,
            part_rank: 2
          }
        ]
      },
      12: { // December
        total_cost: 1800.25,
        mom_change: -5.5,
        top_recurring_issues: [
          {
            part_name: "Battery",
            part_count: 1,
            part_cost: 250.00,
            part_rank: 1
          }
        ]
      }
    }
  ],
  [
    2022,
    {
      total_cost: 11520.00,
      yoy_change: -3.2,
      top_recurring_issues: [
        {
          part_name: "Oil Filter",
          part_count: 5,
          part_cost: 350.00,
          part_rank: 1
        },
        {
          part_name: "Windshield Wipers",
          part_count: 3,
          part_cost: 90.00,
          part_rank: 2
        }
      ],
      3: { // March
        total_cost: 1200.00,
        mom_change: null,
        top_recurring_issues: [
          {
            part_name: "Oil Filter",
            part_count: 1,
            part_cost: 70.00,
            part_rank: 1
          }
        ]
      },
      7: { // July
        total_cost: 2500.00,
        mom_change: 15.0,
        top_recurring_issues: [
          {
            part_name: "Tires",
            part_count: 4,
            part_cost: 1200.00,
            part_rank: 1
          }
        ]
      },
      11: { // November
        total_cost: 980.50,
        mom_change: -8.2,
        top_recurring_issues: []
      }
    }
  ],
  [
    2021,
    {
      total_cost: 11900.25,
      yoy_change: null,
      top_recurring_issues: [],
      5: { // May
        total_cost: 1500.75,
        mom_change: null,
        top_recurring_issues: [
          {
            part_name: "Brake Pads",
            part_count: 2,
            part_cost: 340.00,
            part_rank: 1
          }
        ]
      }
    }
  ]
];