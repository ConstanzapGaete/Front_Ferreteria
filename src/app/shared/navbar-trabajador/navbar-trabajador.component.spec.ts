import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTrabajadorComponent } from './navbar-trabajador.component';

describe('NavbarTrabajadorComponent', () => {
  let component: NavbarTrabajadorComponent;
  let fixture: ComponentFixture<NavbarTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarTrabajadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
