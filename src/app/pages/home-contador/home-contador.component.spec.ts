import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContadorComponent } from './home-contador.component';

describe('HomeContadorComponent', () => {
  let component: HomeContadorComponent;
  let fixture: ComponentFixture<HomeContadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeContadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
