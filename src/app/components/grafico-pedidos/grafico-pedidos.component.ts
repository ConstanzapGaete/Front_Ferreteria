import { Component, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DesempenoService } from '../../services/desempeno.service';

@Component({
  selector: 'app-grafico-pedidos',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './grafico-pedidos.component.html',
})
export class GraficoPedidosComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Pedidos por mes'
      }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  constructor(private desempenoService: DesempenoService) {}

  ngOnInit(): void {
    this.desempenoService.obtenerPedidosPorMes().subscribe(data => {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      const fechas = Object.keys(data).map(key => {
        const [mesTexto, anio] = key.split(' ');
        const mesIndex = meses.indexOf(mesTexto);
        return {
          label: key,
          date: new Date(parseInt(anio), mesIndex),
          count: data[key]
        };
      });

      fechas.sort((a, b) => a.date.getTime() - b.date.getTime());

      this.chartData.labels = fechas.map(f => f.label);
      this.chartData.datasets[0].data = fechas.map(f => f.count);

      if (this.chart) {
        this.chart.update();
      }
    });
  }
}
