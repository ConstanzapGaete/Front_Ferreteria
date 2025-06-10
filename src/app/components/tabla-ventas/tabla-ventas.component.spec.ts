import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVentasComponent } from './tabla-ventas.component';

describe('TablaVentasComponent', () => {
  let component: TablaVentasComponent;
  let fixture: ComponentFixture<TablaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
