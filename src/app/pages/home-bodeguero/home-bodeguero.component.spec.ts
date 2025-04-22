import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBodegueroComponent } from './home-bodeguero.component';

describe('HomeBodegueroComponent', () => {
  let component: HomeBodegueroComponent;
  let fixture: ComponentFixture<HomeBodegueroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBodegueroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBodegueroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
