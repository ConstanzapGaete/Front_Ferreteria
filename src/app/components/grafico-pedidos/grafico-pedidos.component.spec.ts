import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPedidosComponent } from './grafico-pedidos.component';

describe('GraficoPedidosComponent', () => {
  let component: GraficoPedidosComponent;
  let fixture: ComponentFixture<GraficoPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
