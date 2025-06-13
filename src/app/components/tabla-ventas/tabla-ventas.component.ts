import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tabla-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-ventas.component.html',
  styleUrl: './tabla-ventas.component.css'
})
export class TablaVentasComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private reporteService: ReporteService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.reporteService.obtenerVentasPDF().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (err) => console.error('Error al obtener PDF de ventas', err)
    });
  }

  ngOnDestroy(): void {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl.toString());
    }
  }
}
